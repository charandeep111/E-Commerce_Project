const mongoose = require('mongoose');
const uri = 'mongodb+srv://Charandeep:Greenfrog12@cluster0.kxw55gr.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

async function test() {
    try {
        console.log('Testing connection with password Greenfrog12...');
        await mongoose.connect(uri);
        console.log('SUCCESS: Connected to Atlas!');
        await mongoose.connection.close();
    } catch (err) {
        console.error('FAILURE:', err.message);
    }
}

test();
