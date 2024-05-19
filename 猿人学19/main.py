import requests
import json


cookie = {
    'sessionid': '7h5kr1oz0ow8m26tvldpny55pf5165bg'
}

params = {}
value_arr = []
for page in range(1, 6):
    url = f'https://match.yuanrenxue.cn/api/match/19?page={page}'
    res = requests.get(url=url, cookies=cookie)
    value_list =json.loads(res.text)['data']
    for value in value_list:
        value_arr.append(value['value'])

print(sum(value_arr))
