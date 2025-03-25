import requests
import time

target = 'http://localhost:3000'

def make_request():
    try:
        response = requests.get(target)
        if response.status_code == 404:
            print(f"🚨 SERVER CRASHED! (Request {response.headers.get('X-Request-Count')})")
            print(f"Response: {response.json()}")
            return False
        else:
            data = response.json()
            print(f"✅ Request {response.headers.get('X-Request-Count')}: {data['message']}")
            print(f"   Requests: {data['requests']}/{REQUEST_LIMIT}, Remaining: {data['remaining']}")
            return True
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Request failed: {e}")
        return False

def reset_server():
    try:
        response = requests.get(f"{target}/reset")
        print(f"\n🔄 {response.json()['message']}\n")
    except requests.exceptions.RequestException as e:
        print(f"Failed to reset server: {e}")

# Constants
REQUEST_LIMIT = 10
DELAY_SECONDS = 0.5  # Half second between requests

if __name__ == "__main__":
    print(f"Testing server at {target} (will crash after {REQUEST_LIMIT} requests)")
    
    while True:
        if not make_request():
            reset_server()
            time.sleep(1)  # Wait a second after reset
        time.sleep(DELAY_SECONDS)