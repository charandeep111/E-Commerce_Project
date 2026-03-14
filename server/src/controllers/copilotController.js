const Product = require('../models/Product');
const { resolveProductImagesFromDoc } = require('../config/imageRegistry');

// @desc   Recommend a product bundle based on natural language goal
// @route  POST /api/copilot/recommend
// @access Public
exports.recommendBundle = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ msg: 'Please provide a query.' });
        }

        const lowerQuery = query.toLowerCase();
        
        // Extract budget
        let budget = null;
        const budgetMatch = lowerQuery.match(/(?:under|below|for|budget) \$?(\d+)/i) || lowerQuery.match(/\$?(\d+)/);
        if (budgetMatch) {
            budget = parseInt(budgetMatch[1], 10);
        }
        if (!budget) budget = 1000; // default safe budget

        // Extract intent / category mapping
        let targetCategory = null;
        let keywords = [];
        
        if (lowerQuery.includes('gym') || lowerQuery.includes('fitness') || lowerQuery.includes('workout') || lowerQuery.includes('dumbbell') || lowerQuery.includes('bench')) {
            targetCategory = 'Fitness Equipment';
            keywords = ['dumbbell', 'bench', 'band', 'mat', 'treadmill'];
        } else if (lowerQuery.includes('watch') || lowerQuery.includes('smartwatch')) {
            targetCategory = 'Watches';
            keywords = ['apple', 'samsung', 'garmin', 'watch'];
        } else if (lowerQuery.includes('electronics') || lowerQuery.includes('gaming') || lowerQuery.includes('computer') || lowerQuery.includes('pc') || lowerQuery.includes('audio')) {
            targetCategory = 'Electronics';
            keywords = ['headphone', 'speaker', 'laptop', 'mouse'];
        } else if (lowerQuery.includes('accessory') || lowerQuery.includes('bag') || lowerQuery.includes('wallet')) {
            targetCategory = 'Accessories';
            keywords = ['bag', 'wallet', 'belt'];
        } else {
            // Unclear category, extract tokens
            const tokens = lowerQuery.replace(/[^\w\s]/g, '').split(' ');
            const stopWords = ['build', 'a', 'an', 'under', 'for', 'best', 'setup', 'beginner', 'small', 'apartment', 'the', 'of', 'in', 'to', 'with'];
            keywords = tokens.filter(t => !stopWords.includes(t) && isNaN(t));
        }

        // Query database
        let filter = {};
        if (targetCategory) {
            // Include target category
            // We can also let the regex handle it if we want to be more broad, but exact category match is safer if it matched.
            filter.$or = [
                { category: { $regex: targetCategory, $options: 'i' } }
            ];
            // Optionally add keywords matching to title/description for better relevancy within category
        } else if (keywords.length > 0) {
             const keywordRegex = keywords.join('|');
             filter.$or = [
                 { title: { $regex: keywordRegex, $options: 'i' } },
                 { description: { $regex: keywordRegex, $options: 'i' } },
                 { category: { $regex: keywordRegex, $options: 'i' } }
             ];
        }

        const availableProducts = await Product.find(filter).sort({ price: 1 });

        // If no products match exactly by category, try falling back to just search keywords globally
        if (availableProducts.length === 0 && targetCategory) {
            const fallbackTokens = lowerQuery.replace(/[^\w\s]/g, '').split(' ').filter(t => isNaN(t) && t.length > 2);
            if (fallbackTokens.length > 0) {
                const keywordRegex = fallbackTokens.join('|');
                const fallbackFilter = {
                    $or: [
                        { title: { $regex: keywordRegex, $options: 'i' } },
                        { description: { $regex: keywordRegex, $options: 'i' } },
                        { category: { $regex: keywordRegex, $options: 'i' } }
                    ]
                };
                availableProducts.push(...await Product.find(fallbackFilter).sort({ price: 1 }));
            }
        }

        // Bundle selection algorithm
        let currentTotal = 0;
        const bundle = [];
        const seenCategoriesOrTypes = new Set(); // Prevent duplicates like 2 identical benches

        for (const product of availableProducts) {
            if (currentTotal + product.price <= budget) {
                // Ensure variety (don't add two products of exact same title or productType)
                const typeKey = product.productType || product.title;
                if (!seenCategoriesOrTypes.has(typeKey)) {
                    bundle.push(resolveProductImagesFromDoc(product));
                    currentTotal += product.price;
                    seenCategoriesOrTypes.add(typeKey);
                }
            }
        }

        if (bundle.length === 0) {
            return res.status(200).json({
                 goal: query,
                 budget,
                 products: [],
                 totalPrice: 0,
                 message: 'Could not find a bundle that matches your criteria. Try adjusting the budget or using different keywords.'
            });
        }

        res.status(200).json({
            goal: query,
            budget,
            products: bundle,
            totalPrice: currentTotal
        });

    } catch (err) {
        console.error('Copilot Error:', err);
        res.status(500).json({ msg: 'Server error parsing request.' });
    }
};
