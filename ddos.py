import requests
taget = "https://enthusia.vercel.app/"

while True:
    r = requests.get(taget)
    print(r.status_code)    