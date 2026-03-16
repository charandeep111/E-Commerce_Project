const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./server/src/models/User');

async function findVendor() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        let vendor = await User.findOne({ role: 'vendor' });
        if (!vendor) {
            console.log('No vendor found, looking for any user...');
            vendor = await User.findOne({});
        }
        
        if (vendor) {
            console.log('VENDOR_ID:' + vendor._id);
            console.log('VENDOR_NAME:' + vendor.name);
        } else {
            console.log('NO_USERS_FOUND');
        }
        
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

findVendor();
