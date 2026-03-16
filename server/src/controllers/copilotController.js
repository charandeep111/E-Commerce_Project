const Product = require('../models/Product');
const { resolveProductImagesFromDoc } = require('../config/imageRegistry');

// ─── Natural Language Parser ─────────────────────────────────────────────────

/**
 * Detects a maximum price constraint from natural-language phrases like:
 *   "below 2000", "under ₹1500", "less than 50000", "budget 3000", "for 1000"
 * Returns the numeric limit, or null if none found.
 */
function extractMaxPrice(text) {
    const patterns = [
        /(?:below|under|less\s+than|cheaper\s+than|max(?:imum)?|upto?|budget(?:\s+of)?|within|for\s+(?:around\s+)?|at\s+most)\s*[₹$]?\s*(\d[\d,]*)/i,
        /[₹$]\s*(\d[\d,]*)\s*(?:or\s+less|max|maximum)/i,
        /(\d[\d,]*)\s*(?:or\s+less|max|maximum)/i,
        /[₹$]\s*(\d[\d,]*)/,   // bare "₹2000" / "$2000"
    ];
    for (const re of patterns) {
        const m = text.match(re);
        if (m) return parseInt(m[1].replace(/,/g, ''), 10);
    }
    return null;
}

/**
 * Strips price-related tokens and common stop-words from a query so only
 * meaningful product keywords remain.
 */
function extractKeywords(text) {
    // Remove price expressions first
    let cleaned = text
        .replace(/(?:below|under|less\s+than|cheaper\s+than|max(?:imum)?|upto?|budget(?:\s+of)?|within|at\s+most)\s*[₹$]?\s*\d[\d,]*/gi, '')
        .replace(/[₹$]\s*\d[\d,]*\s*(?:or\s+less|max(?:imum)?)?/gi, '')
        .replace(/\d[\d,]*\s*(?:or\s+less|max(?:imum)?)/gi, '')
        .replace(/[₹$]/g, '');

    // Tokenise
    const stopWords = new Set([
        'a', 'an', 'the', 'and', 'or', 'for', 'of', 'in', 'on', 'at', 'to',
        'with', 'build', 'setup', 'best', 'good', 'nice', 'get', 'me', 'my',
        'want', 'need', 'buy', 'find', 'show', 'suggest', 'recommend', 'some',
        'any', 'is', 'are', 'it', 'that', 'this', 'there', 'have', 'has',
        'can', 'could', 'would', 'should', 'i', 'around', 'about', 'affordable',
        'cheap', 'price', 'priced', 'cost', 'worth', 'rupees', 'rs', 'inr',
        'please', 'give', 'list', 'tell', 'looking',
    ]);

    return cleaned
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length > 1 && !stopWords.has(t) && isNaN(t));
}

/**
 * Very broad synonym / category expansion so "football" also matches "sports"
 * products and vice-versa, where appropriate.
 */
function expandKeywords(kws) {
    const expansions = {
        gym:         ['gym', 'fitness', 'workout', 'dumbbell', 'barbell', 'treadmill', 'bench'],
        fitness:     ['fitness', 'gym', 'workout', 'exercise'],
        cricket:     ['cricket', 'bat', 'ball', 'pads', 'gloves', 'sports'],
        football:    ['football', 'soccer', 'sports'],
        basketball:  ['basketball', 'sports', 'hoop'],
        badminton:   ['badminton', 'shuttlecock', 'racket', 'racquet', 'sports'],
        tennis:      ['tennis', 'racket', 'racquet', 'sports'],
        yoga:        ['yoga', 'mat', 'pilates', 'fitness'],
        laptop:      ['laptop', 'notebook', 'computer', 'electronics'],
        mobile:      ['mobile', 'phone', 'smartphone', 'electronics'],
        phone:       ['phone', 'mobile', 'smartphone', 'electronics'],
        smartwatch:  ['smartwatch', 'watch', 'wearable', 'electronics'],
        watch:       ['watch', 'smartwatch', 'wearable'],
        headphone:   ['headphone', 'earphone', 'earbuds', 'audio', 'electronics'],
        speaker:     ['speaker', 'audio', 'bluetooth', 'electronics'],
        gaming:      ['gaming', 'game', 'console', 'controller', 'electronics'],
        camera:      ['camera', 'photography', 'electronics'],
        bag:         ['bag', 'backpack', 'handbag', 'accessory'],
        wallet:      ['wallet', 'purse', 'accessory'],
        shoe:        ['shoe', 'shoes', 'sneaker', 'footwear'],
        shirt:       ['shirt', 'tshirt', 't-shirt', 'top', 'clothing'],
        jean:        ['jeans', 'denim', 'trouser', 'clothing'],
        dress:       ['dress', 'frock', 'clothing'],
    };

    const expanded = new Set(kws);
    for (const kw of kws) {
        if (expansions[kw]) {
            expansions[kw].forEach(e => expanded.add(e));
        }
    }
    return [...expanded];
}

// ─── Controller ──────────────────────────────────────────────────────────────

// @desc   Recommend products based on natural language query
// @route  POST /api/copilot/recommend
// @access Public
exports.recommendBundle = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query || !query.trim()) {
            return res.status(400).json({ msg: 'Please provide a query.' });
        }

        // ── 1. Parse the query ───────────────────────────────────────────
        const maxPrice = extractMaxPrice(query);
        const rawKeywords = extractKeywords(query);
        const expandedKeywords = expandKeywords(rawKeywords);

        console.log(`[Copilot] query="${query}" → rawKeywords=[${rawKeywords}] maxPrice=${maxPrice}`);

        // Helper: build $or clause from a list of keyword strings
        function buildKeywordOr(kws) {
            const re = kws.join('|');
            return [
                { title:       { $regex: re, $options: 'i' } },
                { category:    { $regex: re, $options: 'i' } },
                { subCategory: { $regex: re, $options: 'i' } },
                { productType: { $regex: re, $options: 'i' } },
                { brand:       { $regex: re, $options: 'i' } },
                { description: { $regex: re, $options: 'i' } },
            ];
        }

        // ── 2. Cascading query strategy (most precise → most permissive) ─
        //   Pass 1: raw keywords + price limit   (most specific)
        //   Pass 2: expanded keywords + price limit
        //   Pass 3: raw keywords only (no price limit – flagged as fallback)
        //   Pass 4: expanded keywords only           (last resort)
        let products = [];
        let fallbackUsed = false; // true when we had to drop the price cap

        const priceFilter = maxPrice !== null ? { price: { $lte: maxPrice } } : {};

        if (rawKeywords.length > 0) {
            // Pass 1
            products = await Product.find({ ...priceFilter, $or: buildKeywordOr(rawKeywords) }).sort({ price: 1 }).lean();

            if (products.length === 0) {
                // Pass 2 – try synonym expansion but keep price filter
                products = await Product.find({ ...priceFilter, $or: buildKeywordOr(expandedKeywords) }).sort({ price: 1 }).lean();
            }

            if (products.length === 0 && maxPrice !== null) {
                // Pass 3 – drop price cap, search by raw keyword only
                products = await Product.find({ $or: buildKeywordOr(rawKeywords) }).sort({ price: 1 }).lean();
                fallbackUsed = products.length > 0;
            }

            if (products.length === 0) {
                // Pass 4 – drop price cap, use expanded keywords
                products = await Product.find({ $or: buildKeywordOr(expandedKeywords) }).sort({ price: 1 }).lean();
                fallbackUsed = products.length > 0;
            }
        } else if (maxPrice !== null) {
            // No keywords at all – return all products within budget
            products = await Product.find(priceFilter).sort({ price: 1 }).lean();
        }

        // ── 4. Score results – prioritise exact keyword match in title ────
        const primaryKeywords = rawKeywords; // unexpanded, more specific
        const primaryRegex = new RegExp(primaryKeywords.join('|'), 'i');

        products.sort((a, b) => {
            const aExact = primaryRegex.test(a.title) ? 0 : 1;
            const bExact = primaryRegex.test(b.title) ? 0 : 1;
            if (aExact !== bExact) return aExact - bExact;
            return a.price - b.price; // then price ASC
        });

        // ── 5. Build result list (de-duplicate by productType/title) ─────
        const MAX_RESULTS = 12;
        const seenTypes = new Set();
        const resultProducts = [];

        for (const product of products) {
            if (resultProducts.length >= MAX_RESULTS) break;
            const typeKey = (product.productType || product.title || '').toLowerCase().slice(0, 40);
            if (!seenTypes.has(typeKey)) {
                resultProducts.push(resolveProductImagesFromDoc(product));
                seenTypes.add(typeKey);
            }
        }

        // ── 6. Build response ────────────────────────────────────────────
        const totalPrice = resultProducts.reduce((sum, p) => sum + p.price, 0);

        if (resultProducts.length === 0) {
            return res.status(200).json({
                goal: query,
                maxPrice,
                keywords: rawKeywords,
                products: [],
                totalPrice: 0,
                message: `No products found matching "${rawKeywords.join(', ')}"${maxPrice ? ` under ₹${maxPrice.toLocaleString()}` : ''}. Try broader terms or a higher budget.`,
            });
        }

        let message = null;
        if (fallbackUsed && maxPrice !== null) {
            message = `No products under ₹${maxPrice.toLocaleString()} matched your search. Showing the closest results — prices may be higher.`;
        }

        return res.status(200).json({
            goal: query,
            maxPrice,
            keywords: rawKeywords,
            products: resultProducts,
            totalPrice,
            ...(message ? { message } : {}),
        });

    } catch (err) {
        console.error('Copilot Error:', err);
        res.status(500).json({ msg: 'Server error parsing request.' });
    }
};
