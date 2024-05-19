import json

import execjs
import requests
import pandas as pd
with open('get_cookie.js', 'r', encoding='UTF-8') as js:
    js_code = js.read()
data_list = []
for page in range(1, 6):
    url = f'https://match.yuanrenxue.cn/api/match/5?page={page}'
    cookies = {
        'sessionid': '1r7guxnlg0bsm2lsdm7nnsjlg8gkkmqt'
    }
    get_cookie = execjs.compile(js_code)
    cookie_param = get_cookie.call('getcookie')
    cookies['RM4hZBv0dDon443M'] = cookie_param['RM4hZBv0dDon443M']
    cookies['m'] = cookie_param['m']
    print(cookies['m'])
    headers = {
        "Host": "match.yuanrenxue.cn",
        "Connection": "keep-alive",
        "Content-Length": "0",
        "sec-ch-ua": '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "yuanrenxue.project",
        "sec-ch-ua-platform": '"Windows"',
        "Accept": "*/*",
        "Origin": "https://match.yuanrenxue.cn",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://match.yuanrenxue.cn/match/5",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en,zh-CN;q=0.9,zh;q=0.8",
        'X-Requested-With': 'XMLHttpRequest'
    }
    params = {}
    params['m'] = cookie_param['_$is']
    params['f'] = cookie_param['_$t1']
    re = requests.get(url, headers=headers, cookies=cookies, params=params)
    text = json.loads(re.text)
    text_data = text['data']
    print(text_data)
    for i in range(0, len(text_data)):
        data_list.append(text_data[i]['value'])
print(data_list)

sum = 0
for i in (pd.Series(data_list).sort_values(ascending = False).index[:5]):
    sum = sum+ (data_list[i])
print(sum)
