require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../src/models/Category');
const Subcategory = require('../src/models/Subcategory');

const fixSubcategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to DB');

        const mapping = {
            'Electronics': ['Smartphones', 'Laptops', 'Cameras'],
            'Fashion': ['Clothing', 'Footwear', 'Accessories'],
            'Sports': ['Gym Equipment', 'Outdoor Sports'],
            'Home': ['Furniture', 'Kitchen Appliances'],
            'Beauty': ['Skincare', 'Haircare']
        };

        for (const [catName, subNames] of Object.entries(mapping)) {
            let category = await Category.findOne({ name: catName });
            if (!category) {
                console.log(`Category ${catName} not found, creating...`);
                category = await Category.create({ name: catName, slug: catName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') });
            }

            for (const subName of subNames) {
                let subcategory = await Subcategory.findOne({ name: subName });
                if (subcategory) {
                    subcategory.categoryId = category._id;
                    await subcategory.save();
                    console.log(`Updated subcategory ${subName} to belong to ${catName}`);
                } else {
                    await Subcategory.create({
                        name: subName,
                        slug: subName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
                        categoryId: category._id
                    });
                    console.log(`Created subcategory ${subName} under ${catName}`);
                }
            }
        }
        
        console.log('Done mapping.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixSubcategories();
