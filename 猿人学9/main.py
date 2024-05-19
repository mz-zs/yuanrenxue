import requests
import re
from py_mini_racer import MiniRacer
import json
import numpy as np

racer = MiniRacer()
with open('./环境/js_code.js', 'r', encoding='utf-8') as fl:
    jscode = fl.read()
racer.eval(jscode)


def get_first_ten_numbers(s):
    # decrypt后的前十个数字
    pattern = r"(?:\bdecrypt\b.*?(\d{10}))"
    match = re.search(pattern, s)
    return match.group(0)


cookie_url = 'https://match.yuanrenxue.cn/match/9'

headers = {
    'Referer': 'https://match.yuanrenxue.cn/match/9',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'yuanrenxue.project',
    'Host': 'match.yuanrenxue.cn'
}

value_num = []

for page in range(1, 6):
    url = f'https://match.yuanrenxue.cn/api/match/9?page={page}'
    session = requests.session()
    session.headers = headers
    res = session.get(url=cookie_url)
    timestamp = get_first_ten_numbers(res.text)[-10:]
    print("时间戳:" + timestamp)
    racer_result = racer.call('get_cookie', timestamp)[2:]
    print(racer_result)
    Cookie = {
        'm': racer_result
    }
    session.cookies.update(Cookie)
    resp = session.get(url=url)
    value_list = json.loads(resp.text)
    print(value_list['data'])
    for value in value_list['data']:
        value_num.append(value['value'])
print(np.mean(value_num))
