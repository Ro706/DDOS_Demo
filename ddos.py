# import requests
# taget = "https://enthusia.vercel.app/"

# while True:
#     r = requests.get(taget)
#     print(r.status_code)  
  
import requests
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Constants
TARGET_URL = "https://enthusia.vercel.app/"
REQUEST_INTERVAL = 60  # Time in seconds between requests

def fetch_status_code(url):
    try:
        response = requests.get(url)
        return response.status_code
    except requests.RequestException as e:
        logging.error(f"Request failed: {e}")
        return None

def main():
    logging.info("Starting the status code checker.")
    try:
        while True:
            status_code = fetch_status_code(TARGET_URL)
            if status_code is not None:
                logging.info(f"Status code: {status_code}")
            time.sleep(REQUEST_INTERVAL)
    except KeyboardInterrupt:
        logging.info("Shutting down gracefully.")

if __name__ == "__main__":
    main()
