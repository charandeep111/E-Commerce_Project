const http = require('http');

const queries = [
    'A football below 2000',
    'laptop under 50000',
    'smartwatch below 3000',
    'cricket bat under 2000',
    'wireless earbuds below 1500',
];

function test(query) {
    return new Promise((resolve) => {
        const body = JSON.stringify({ query });
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/copilot/recommend',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
        };
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const j = JSON.parse(data);
                    const divider = '─'.repeat(55);
                    console.log(divider);
                    console.log('Query   :', j.goal);
                    console.log('Keywords:', JSON.stringify(j.keywords));
                    console.log('MaxPrice:', j.maxPrice != null ? '₹' + j.maxPrice : 'none');
                    console.log('Results :', j.products ? j.products.length : 0);
                    if (j.products) {
                        j.products.slice(0, 5).forEach((p) => {
                            console.log('  -', p.title, '| ₹' + p.price);
                        });
                    }
                    if (j.message) console.log('NOTE:', j.message);
                } catch (e) {
                    console.log('Parse error:', e.message, 'Raw:', data.slice(0, 200));
                }
                resolve();
            });
        });
        req.on('error', (e) => {
            console.error('Request failed for "' + query + '":', e.message);
            resolve();
        });
        req.setTimeout(8000, () => {
            req.destroy(new Error('Timeout'));
        });
        req.write(body);
        req.end();
    });
}

(async () => {
    for (const q of queries) {
        await test(q);
    }
    console.log('\n✅ All tests complete.');
})();
