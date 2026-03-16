const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function findUser() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db();
        const users = db.collection('users');
        const user = await users.findOne({});
        if (user) {
            console.log('USER_ID:' + user._id.toString());
        } else {
            console.log('NO_USER');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

findUser();
