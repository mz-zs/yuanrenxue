import os
import execjs
import requests
import json
url = 'https://match.yuanrenxue.cn/api/match/6'
params = {
}

headers = {
    'Host':'match.yuanrenxue.cn',
    'Referer':'https://match.yuanrenxue.cn/match/6',
    'User-Agent':'yuanrenxue.project',
    'X-Requested-With':'XMLHttpRequest',
    'Cookie':'sessionid=d3aeeuu20xtynv5xo34u1is7tjniy8op'
}


with open('param.js','r',encoding='UTF-8') as js:
    js_code = js.read()
    sum_money = 0
for page in range(1,6):
    params['page'] = page
    result = execjs.compile(js_code).call('param')
    params['m'] = result[0]
    params['q'] =  '1'+'-'+f'{result[1]}'+'|'
    response = requests.get(url,params=params,headers=headers)
    datas = response.text
    datas = json.loads(datas)
    datas = datas['data']
    for data in datas:
       sum_money = sum_money+ data['value']*24
print(sum_money)
