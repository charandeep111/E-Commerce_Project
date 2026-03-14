const app = require('./server/server');
const PORT = 5001; // use different port
const server = app.listen(PORT, () => {
    console.log('Server booted successfully on port', PORT);
    server.close();
    process.exit(0);
});

setTimeout(() => {
    console.error('Server boot timed out');
    process.exit(1);
}, 10000);
