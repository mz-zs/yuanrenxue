import requests
import execjs
import json
url = 'https://match.yuanrenxue.cn/match/18data'
with open('get_param.js','r') as f:
    jscode = f.read()

jsexec = execjs.compile(jscode)
cookie = {
    'sessionid':'1blzfr37r5c7jm4jze50g3kf7kphanjp'
}
num_arr = []
for page in range(1,6):
    params = jsexec.call('get_params',page)
    print(params)
    res = requests.get(url,cookies=cookie,params=params)
    print(res.text)
    data_list = json.loads(res.text)['data']
    for data in data_list:
        num_arr.append(data['value'])

print(sum(num_arr))