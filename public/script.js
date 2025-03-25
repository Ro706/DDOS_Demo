document.addEventListener('DOMContentLoaded', function() {
    const requestBtn = document.getElementById('request-btn');
    const requestCountElement = document.getElementById('request-count');
    const responseContainer = document.getElementById('response-container');
    
    let clientRequestCount = 0;
    
    requestBtn.addEventListener('click', function() {
        clientRequestCount++;
        requestCountElement.textContent = clientRequestCount;
        
        fetch('/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server crashed');
                }
                return response.text();
            })
            .then(html => {
                responseContainer.innerHTML = `
                    <div class="success">
                        Request ${clientRequestCount} successful
                    </div>
                `;
            })
            .catch(error => {
                responseContainer.innerHTML = `
                    <div class="error">
                        ${error.message} (HTTP 404)
                    </div>
                `;
                requestBtn.disabled = true;
            });
    });
});