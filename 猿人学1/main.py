import time

import execjs
import requests
with open('param_f.js','r') as js:
    js_code = js.read()
f = execjs.compile(js_code)

headers = {
'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
'Referer': 'https://match.yuanrenxue.cn/match/1',
'X-Requested-With':'XMLHttpRequest',
'Host':'match.yuanrenxue.cn',

         }
page = [1, 2, 3, 4, 5]
sum_num = 0
index_num = 0
for i in page:
        param_m = f.call('my_fun')
        url = f'https://match.yuanrenxue.cn/api/match/1?page={i}&m={param_m}'
        print(param_m)
        time.sleep(1)
        re = requests.get(url,headers=headers)
        re = re.json()
        data = [__['value'] for __ in re['data']]
        print(data)
        sum_num += sum(data)
        index_num += len(data)
average = sum_num/index_num
print(average)



