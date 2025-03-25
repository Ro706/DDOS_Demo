import requests
import time

SERVER = "http://localhost:3000"
API_ENDPOINT = f"{SERVER}/api"
LIMIT = 18
DELAY = 0.5  # 500ms between requests

def make_request():
    try:
        response = requests.get(API_ENDPOINT)
        if response.status_code == 404:
            data = response.json()
            print(f"🚨 CRASHED at {data['totalRequests']} requests")
            return False
        data = response.json()
        print(f"✅ Request {data['currentCount']}/{LIMIT}")
        return True
    except Exception as e:
        print(f"⚠️ Error: {e}")
        return False

if __name__ == "__main__":
    print(f"Sending requests to {API_ENDPOINT}")
    print(f"Will crash after {LIMIT} requests\n")
    
    while True:
        if not make_request():
            print("\nServer has crashed. Open browser to reset.")
            break
        time.sleep(DELAY)