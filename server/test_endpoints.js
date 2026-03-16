const http = require('http');

const endpoints = [
    '/api/health',
    '/api/categories',
    '/api/products'
];

async function testEndpoint(path) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:5000${path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`GET ${path} - Status: ${res.statusCode}`);
                try {
                    const json = JSON.parse(data);
                    console.log(`Response length: ${Array.isArray(json) ? json.length : Object.keys(json).length}`);
                } catch (e) {
                    console.log('Non-JSON response');
                }
                resolve();
            });
        });
        req.on('error', (err) => {
            console.error(`GET ${path} - Error: ${err.message}`);
            resolve();
        });
    });
}

(async () => {
    for (const endpoint of endpoints) {
        await testEndpoint(endpoint);
    }
})();
