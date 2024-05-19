import time

import execjs
import requests

with open('get_m.js','r') as js:
    js_code = js.read()
m = execjs.compile(js_code)


pages_list = [1, 2, 3, 4, 5]
get_sum = 0
for i in pages_list:
    url = f'https://match.yuanrenxue.cn/api/match/2?page={i}'
    headers = {
    'Host':'match.yuanrenxue.cn',
    'User-Agent':'yuanrenxue.project',
    'X-Requested-With':'XMLHttpRequest',
    'Referer':'https://match.yuanrenxue.cn/match/2'
    }
    cookies = {
        'sessionid' :'lobqoq140pdxk6axz9knr4b7tvkhqyrm'
    }

    cookies['m'] = (m.call('get_m'))
    print(cookies)
    re = requests.get(url,headers=headers,cookies=cookies)
    print(re)
    re = re.json()
    time.sleep(1)
    data = [__['value'] for __ in re['data']]
    get_sum += sum(data)
print(get_sum)




