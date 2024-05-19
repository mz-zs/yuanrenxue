import time
import hashlib
import json
import requests


def get_sign(page):
    timestamp = int(time.time()) * 1000
    sign = hashlib.md5((str(page) + '|' + str(timestamp) + 'D#uqGdcw41pWeNXm').encode()).hexdigest()
    return {'page': str(page),
            'sign': sign,
            't': timestamp}


url = 'https://match.yuanrenxue.cn/api/match/20'
cookie = {
    'sessionid': '35hgo3q4qaz5hbw386hue0z1wlydsnt5'
}
value_arr = []
for page in range(1, 6):
    params = get_sign(page)
    res = requests.get(url, params=params, cookies=cookie)
    print(res.text)
    data = json.loads(res.text)['data']
    for value in data:
        value_arr.append(value['value'])

print(sum(value_arr))
