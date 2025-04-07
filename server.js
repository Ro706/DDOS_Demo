const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

let requestCount = 0;
let serverCrashed = false;
const REQUEST_LIMIT = 10;
const clients = new Set(); // For Server-Sent Events

app.use(express.static(path.join(__dirname, 'public')));

// Middleware to count API requests
app.use((req, res, next) => {
    if (req.path === '/api') {
        requestCount++;
        console.log(`API Request #${requestCount} received`);
        
        if (requestCount >= REQUEST_LIMIT) {
            serverCrashed = true;
            console.log('SERVER CRASHED!');
        }
        notifyClients();
    }
    next();
});

// API endpoint for Python
app.get('/api', (req, res) => {
    if (serverCrashed) {
        return res.status(404).json({
            status: 'error',
            message: `Server crashed after ${REQUEST_LIMIT} requests`,
            totalRequests: requestCount
        });
    }
    res.json({
        status: 'success',
        currentCount: requestCount,
        remaining: REQUEST_LIMIT - requestCount
    });
});

// SSE endpoint for real-time updates
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    res.write(`data: ${JSON.stringify({
        count: requestCount,
        crashed: serverCrashed,
        limit: REQUEST_LIMIT
    })}\n\n`);
    
    clients.add(res);
    req.on('close', () => clients.delete(res));
});

// Reset endpoint
app.get('/reset', (req, res) => {
    requestCount = 0;
    serverCrashed = false;
    notifyClients();
    res.json({ status: 'success', message: 'Server reset' });
});

function notifyClients() {
    const data = JSON.stringify({
        count: requestCount,
        crashed: serverCrashed,
        limit: REQUEST_LIMIT
    });
    clients.forEach(client => client.write(`data: ${data}\n\n`));
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Will crash after ${REQUEST_LIMIT} API requests`);
});