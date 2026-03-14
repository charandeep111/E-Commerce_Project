const bcrypt = require('bcryptjs');

const testBcrypt = async () => {
    try {
        const password = 'testpassword';
        const hash = await bcrypt.hash(password, 10);
        console.log('Hash produced:', hash);
        const match = await bcrypt.compare(password, hash);
        console.log('Match success:', match);
    } catch (err) {
        console.error('Bcrypt error:', err);
    }
};

testBcrypt();
