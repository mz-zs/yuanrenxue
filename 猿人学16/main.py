import requests
import execjs
import json
url = 'https://match.yuanrenxue.cn/api/match/16'
headers = {
    'Proxy-Connection': 'keep-alive',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'http://match.yuanrenxue.com/match/16',
    'Accept-Language': 'zh-CN,zh;q=0.9',
}


cookie = {
    'sessionid': '7h5kr1oz0ow8m26tvldpny55pf5165bg'
}
with open('get_m.js', 'r',encoding='utf-8') as f:
    js_code = f.read()
context = execjs.compile(js_code)
params = {}
value_arr = []
for page in range(1, 6):
    result = context.call('get_m')
    params['m'] = result[0]
    params['t'] = result[1]
    params['page'] = page
    print(params)
    res = requests.get(url=url, cookies=cookie, params=params)
    print(res.text)
    data_list = json.loads(res.text)['data']
    for data in data_list:
        value_arr.append(data['value'])

print(sum(value_arr))