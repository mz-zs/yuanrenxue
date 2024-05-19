import json

import execjs
import re
import base64
from curl_cffi import requests
header = {
    'Accept': 'application/json, text/javascript, */* ',
    'q': '0.01',
    'Referer': 'https://match.yuanrenxue.cn/match/10',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
    'Host': 'match.yuanrenxue.cn',
    'X-Requested-With': 'XMLHttpRequest'
}

with open('params.js', 'r') as f:
    jscode = f.read()

session = requests.Session()
response1 = session.get('http://match.yuanrenxue.com/match/10')

changenum = int(re.findall(r'yuanrenxue_59 *= *(\d+)', response1.text)[0])
# print('changenum', changenum)
response2 = session.get('http://match.yuanrenxue.com/stati/mu/rsnkw2ksph')
b64eval = ''.join([chr(ord(i) - idx % changenum - 0x32) for idx,
i in enumerate(response2.text.replace("$_ts['dfe1683']=", '')[1:-1])])
evalstr = base64.b64decode(b64eval.encode()).decode()
# with open('rs.js','w') as f:
#     f.write(evalstr)
v1 = int(re.findall(
    r"_yrxC2_=(\d+) \+ _yrxCxm\['.'\+'.'\+'.'\+'.'\]", evalstr)[0])
v2 = int(re.findall(
    r"_yrxmbl=(\d+) \+ _yrxCxm\['.'\+'.'\+'.'\+'.'\]", evalstr)[0])
v3 = int(re.findall(
    r"return (\d+) \+ _yrxCxm\['.'\+'.'\+'.'\+'.'\]", evalstr)[0])
print(v1, v2, v3)

pattern = re.compile('\d+')
change_param = session.get('https://match.yuanrenxue.cn/api/offset', headers=header).text
print(change_param)

jsexec = execjs.compile(jscode)
change_param = re.findall(pattern, change_param)[0]
print(change_param)
num_array = []
for page in range(1, 6):
    url = jsexec.call('get_url', f"/api/match/10?page={page}",int(v1),int(v2),int(v3),int(change_param))
    print(url)
    res = session.get(url=url, headers=header,impersonate = 'chrome99')
    data = json.loads(res.text)
    print(data)
    for value in data['data']:
        num_array.append(value['value'])
    change_param = (re.findall(r"(\d+)",data['k']['k']))[0]
print(sum(num_array))

