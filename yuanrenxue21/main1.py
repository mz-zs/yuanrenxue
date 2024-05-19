import requests


res = requests.get('https://tls.browserleaks.com/json')

print(res.text)