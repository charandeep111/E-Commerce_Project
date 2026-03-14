const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const testAuth = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const email = 'debug@example.com';
        await User.deleteOne({ email });
        
        const user = new User({
            name: 'Debug User',
            email: email,
            password: 'password123',
            role: 'customer'
        });
        
        await user.save();
        console.log('User created successfully');
        
        const found = await User.findOne({ email });
        console.log('User password matches:', await found.comparePassword('password123'));
        console.log('User cart:', found.cart);
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testAuth();
