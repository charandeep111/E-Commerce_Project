const fs = require('fs');
const crypto = require('crypto');

const categories = ['Watches', 'Mobiles', 'Laptops', 'Headphones', 'Shoes', 'Bags'];
const totalProducts = 120; // 120 / 6 = 20 each
const minPerCategory = 10;
const batchSize = 50;

const priceRanges = {
    "Watches": [2999, 150000],
    "Mobiles": [7999, 149999],
    "Laptops": [24999, 250000],
    "Headphones": [999, 34999],
    "Shoes": [1499, 12999],
    "Bags": [999, 24999]
};

const brands = {
    "Watches": ["Rolex", "Casio", "Fossil", "Titan", "Seiko", "Omega"],
    "Mobiles": ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"],
    "Laptops": ["Apple", "Dell", "HP", "Lenovo", "Asus"],
    "Headphones": ["Sony", "Bose", "JBL", "Sennheiser", "Beats"],
    "Shoes": ["Nike", "Adidas", "Puma", "Reebok", "Vans"],
    "Bags": ["Gucci", "Prada", "Samsonite", "American Tourister", "Wildcraft"]
};

// Valid Unsplash Image IDs for each category
const categoryImages = {
    "Watches": ["1524592094714-0f0654e20314", "1522312346375-d1a52e208932", "1542496658-e33a6d0d50e6", "1526045612212-70fadcd9c94d", "1539874754764-5a96559165b0"],
    "Mobiles": ["1511707171634-61677c473f27", "1592899677789-da412752dd3d", "1601784551446-20c9e07cdbdb", "1567581936302-adc88ac99d81", "1573148195900-7845dcb9d127"],
    "Laptops": ["1496181133206-80ce9b88a853", "1531297424005-27a3db1998f6", "1517336714731-489689fd1ca4", "1525547719571-a2d4ac8945e2", "1588872657578-838c6470814f"],
    "Headphones": ["1505740420928-5e560c06d30e", "1583847268964-b8bd40940452", "1546435770-a3e2feadf723", "1484704849700-f032a568e944", "1590658268037-6bf12165a8df"],
    "Shoes": ["1542291026-7eec264c27ff", "1560769619301-355e8ade3f8e", "1525966235021-331deae23889", "1491553895911-0055eca6402d", "1603808033192-082d6919d3e1"],
    "Bags": ["1584917865442-de89df76afd3", "1553062407-98eeb64c6a62", "1491637639811-60e2756cc1c9", "1590874103328-37813c9805e5", "1564812160934-8b63e6396e95"]
};

// Using 300x300 or similar
const imageURLPattern = "https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=600&q=80";

const slugHistory = new Set();

function generateSlug(name) {
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let originalSlug = slug;
    let counter = 2;
    while (slugHistory.has(slug)) {
        slug = `${originalSlug}-${counter}`;
        counter++;
    }
    slugHistory.add(slug);
    return slug;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

// Names
const productNames = {
    "Watches": ["Classic Analog", "Digital Smart", "Vintage Leather", "Chronograph Pro", "Minimalist Gold"],
    "Mobiles": ["Galaxy S22", "iPhone 14", "Pixel 7", "Redmi Note", "OnePlus 10T"],
    "Laptops": ["MacBook Air", "XPS 13", "ZenBook Duo", "ThinkPad X1", "Pavilion 15"],
    "Headphones": ["Noise Cancelling", "Bass Boosted", "Wireless Over-Ear", "In-Ear Buds", "Studio Monitor"],
    "Shoes": ["Running Zoom", "Classic Sneakers", "Canvas Loafers", "High Top Boots", "Sport Trainers"],
    "Bags": ["Travel Backpack", "Leather Tote", "Laptop Sleeve", "Hiking Rucksack", "Duffle Bag"]
};

function generateProduct(category) {
    const nameBase = productNames[category][randomInt(0, productNames[category].length - 1)];
    const idSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    const name = `${nameBase} ${idSuffix}`;
    const slug = generateSlug(name);

    // Pick random brand
    const brand = brands[category][randomInt(0, brands[category].length - 1)];

    const price = randomInt(priceRanges[category][0], priceRanges[category][1]);
    const hasDiscount = Math.random() < 0.30;
    const discountPrice = hasDiscount ? Math.floor(price * (1 - randomInt(10, 30) / 100)) : null;
    const createdAt = randomDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), new Date());
    const updatedAt = randomDate(new Date(createdAt), new Date()); // logic for updated > created

    // Image
    const imageId = categoryImages[category][randomInt(0, categoryImages[category].length - 1)];
    const imageUrl = imageURLPattern.replace('{id}', imageId);

    return {
        id: crypto.randomUUID(),
        name: name,
        slug: slug,
        description: `Premium ${category} from ${brand}. Experience styling and function with the ${name}.`,
        price: price,
        discountPrice: discountPrice,
        stock: randomInt(10, 200),
        images: [imageUrl],
        category: category,
        tags: [category.toLowerCase(), brand.toLowerCase(), "trending"],
        metadata: { brand: brand, weight: `${randomInt(100, 2000)}g` },
        createdAt: createdAt,
        updatedAt: updatedAt
    };
}

const products = [];
// Ensure min per category
categories.forEach(cat => {
    for (let i = 0; i < minPerCategory; i++) {
        products.push(generateProduct(cat));
    }
});

// Fill rest
const remaining = totalProducts - products.length;
for (let i = 0; i < remaining; i++) {
    const randomCat = categories[randomInt(0, categories.length - 1)];
    products.push(generateProduct(randomCat));
}

// Batching logic if needed for output (but we will just write full JSON to file)
// To strictly follow prompt output format:
let output;
if (batchSize && totalProducts > batchSize) {
    output = [];
    for (let i = 0; i < products.length; i += batchSize) {
        output.push({
            batchIndex: (i / batchSize) + 1,
            products: products.slice(i, i + batchSize)
        });
    }
} else {
    output = products;
}

const outputPath = require('path').join(__dirname, '../products.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
console.log(`Generated ${products.length} products to ${outputPath}`);
