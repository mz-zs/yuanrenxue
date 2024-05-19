import requests
import json
import execjs
import py_mini_racer
import subprocess
from deno_vm import VM
import re

cookies = {
    'sessionid':'fy1hetszha8jo4kz912yaou0gysno957'
}
session = requests.session()


with open('demo1.js', 'r', encoding='UTF-8') as f:
    jscode = f.read()

num_arr = []
for page in range(1, 6):
    response = session.get('https://match.yuanrenxue.com/api/match/14/m', cookies=cookies)
    jsexec = execjs.compile(jscode + ';' + response.text)

    url = f'https://match.yuanrenxue.cn/api/match/14?page={page}'
    cookie = jsexec.call('get_params')
    print(cookie)
    session.cookies.update(cookie)
    res = session.get(url)
    print(res.text)
    data_list = json.loads(res.text)['data']
    for data in data_list:
        print(data['value'])
        num_arr.append(data['value'])


print(sum(num_arr))