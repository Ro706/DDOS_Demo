document.addEventListener('DOMContentLoaded', () => {
    const requestCountEl = document.getElementById('request-count');
    const requestLimitEl = document.getElementById('request-limit');
    const serverStatusEl = document.getElementById('server-status');
    const simulateBtn = document.getElementById('simulate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const eventLog = document.getElementById('event-log');
    
    requestLimitEl.textContent = 10;
    
    // Connect to SSE endpoint
    const eventSource = new EventSource('/events');
    
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateUI(data);
        logEvent(data);
    };
    
    eventSource.onerror = () => {
        console.log('SSE connection error');
        eventSource.close();
    };
    
    simulateBtn.addEventListener('click', () => {
        fetch('/')
            .then(response => {
                if (!response.ok) throw new Error('Server crashed');
            })
            .catch(error => {
                console.log(error.message);
            });
    });
    
    resetBtn.addEventListener('click', () => {
        fetch('/reset')
            .then(response => response.text())
            .then(message => {
                logEvent({ message });
            });
    });
    
    function updateUI(data) {
        requestCountEl.textContent = data.requestCount;
        
        if (data.serverCrashed) {
            serverStatusEl.innerHTML = '🔴 Crashed';
            serverStatusEl.style.color = '#f44336';
            simulateBtn.disabled = true;
        } else {
            serverStatusEl.innerHTML = '🟢 Running';
            serverStatusEl.style.color = '#4CAF50';
            simulateBtn.disabled = false;
        }
    }
    
    function logEvent(data) {
        const now = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'event-entry';
        
        if (data.message) {
            entry.textContent = `[${now}] ${data.message}`;
        } else if (data.serverCrashed) {
            entry.textContent = `[${now}] Server crashed after ${data.requestCount} requests`;
            entry.style.color = '#f44336';
        } else {
            entry.textContent = `[${now}] New request received (${data.requestCount}/${REQUEST_LIMIT})`;
        }
        
        eventLog.prepend(entry);
    }
});