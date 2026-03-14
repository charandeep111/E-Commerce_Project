const http = require('http');

const post = (path, data) => {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length
            }
        }, (res) => {
            let resBody = '';
            res.on('data', (chunk) => resBody += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(resBody);
                    if (res.statusCode >= 400) reject(json);
                    else resolve(json);
                } catch (e) {
                    reject({ msg: 'Invalid JSON response', raw: resBody });
                }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
};

async function runTests() {
    try {
        console.log('Testing Registration...');
        const email = `test_${Date.now()}@example.com`;
        const reg = await post('/auth/register', {
            name: 'API Test',
            email: email,
            password: 'password123',
            role: 'customer'
        });
        console.log('Registration Success:', reg);

        console.log('\nTesting Login...');
        const login = await post('/auth/login', {
            email: email,
            password: 'password123'
        });
        console.log('Login Success:', login);
        
        process.exit(0);
    } catch (err) {
        console.error('Test Failed:', err);
        process.exit(1);
    }
}

runTests();
