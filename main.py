import requests
import time  # For adding delay between requests

target = 'http://localhost:3000'  # The Express server runs on port 3000 by default

while True:
    try:
        response = requests.get(target)
        print(f"Status Code: {response.status_code}, Request Count: {response.text}")
        time.sleep(1)  # Add 1 second delay between requests
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        break