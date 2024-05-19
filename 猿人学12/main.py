import requests
import execjs
import json
import numpy as np
with open('get_m.js', 'r') as fl:
    js_code = fl.read()

context = execjs.compile(js_code)

headers = {
    'Referer': 'https://match.yuanrenxue.cn/match/12',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
    'cookie':'__51vcke__3G5Pk0eEh7wEuiuP=ed50d5c5-30c3-5078-90c1-5937b26a3271; __51vuft__3G5Pk0eEh7wEuiuP=1706181855264; __51uvsct__3G5Pk0eEh7wEuiuP=2; Hm_lvt_434c501fe98c1a8ec74b813751d4e3e3=1708354050; Hm_lvt_c99546cf032aaa5a679230de9a95c7db=1706181855,1706514173,1708408235,1708442647; no-alert3=true; tk=5643636071853415652; Hm_lvt_9bcbda9cbf86757998a2339a0437208e=1706181863,1706514175,1708408237,1708442655; sessionid=juplnwpo4igtf04d01bwt98jjecv045z; m=155; Hm_lpvt_9bcbda9cbf86757998a2339a0437208e=1708509647; Hm_lpvt_c99546cf032aaa5a679230de9a95c7db=1708509668'
}
value_storage = []
for page in range(1, 6):
    url = f'https://match.yuanrenxue.cn/api/match/12'
    m = context.call('get_m', page)
    params = {
        'page': page,
        'm': m
    }
    res = requests.get(url, params=params,headers=headers)
    data_list = (json.loads(res.text))['data']
    for data in data_list:
        value_storage.append(data['value'])
        print(data['value'])

print(sum(value_storage))
