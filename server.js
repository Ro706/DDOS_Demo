const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to track requests
let requestCount = 0;
let serverCrashed = false;
const REQUEST_LIMIT = 10;  // Changed from 5 to 10

app.use((req, res, next) => {
    if (serverCrashed) {
        return res.status(404).send(`
            <h1>Server Overloaded</h1>
            <p>Too many requests (${REQUEST_LIMIT}+). Server has crashed.</p>
            <p>Please try again later.</p>
        `);
    }
    
    requestCount++;
    console.log(`Request #${requestCount} received`);
    
    if (requestCount >= REQUEST_LIMIT) {
        serverCrashed = true;
        console.log(`Server has crashed due to too many requests (${REQUEST_LIMIT})`);
        return res.status(404).send(`
            <h1>Server Overloaded</h1>
            <p>Too many requests (${REQUEST_LIMIT}+). Server has crashed.</p>
            <p>Please try again later.</p>
        `);
    }
    
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Basic route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Reset endpoint (for testing)
app.get('/reset', (req, res) => {
    requestCount = 0;
    serverCrashed = false;
    res.send(`Server reset. Request count: 0 (will crash after ${REQUEST_LIMIT} requests)`);
});

// Endpoint to check current status
app.get('/status', (req, res) => {
    res.send({
        requestCount,
        serverCrashed,
        requestsRemaining: REQUEST_LIMIT - requestCount
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Server will crash after ${REQUEST_LIMIT} requests`);
});