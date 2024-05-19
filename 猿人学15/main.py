import time
import json
import requests
import pywasm
import numpy as np


def get_wasm():
    url = 'https://yuanrenxue.cn/static/match/match15/main.wasm'
    response = requests.get(url).content
    with open("Wasm.wasm", 'wb') as fp:
        fp.write(response)


def q(t1, t2):
    wasm_vm = pywasm.load('main.wasm')
    return wasm_vm.exec('encode', [t1, t2])


def fet_m():
    t = time.time()
    t1 = int((int(round(t * 1000)) / 1000 / 2))
    t2 = int((int(round(t * 1000)) / 1000 / 2 - np.floor(0.5 * (50) + 1)))
    return str(q(t1, t2)) + '|' + str(t1) + '|' + str(t2)


url = 'https://match.yuanrenxue.cn/api/match/15'
headers = {
'cookie':'sessionid=z2y9py49g4f75krsjsnb8ergxoj7la93'
}
params = {
    'm': fet_m()
}
num_array = []
for page in range(1, 6):
    params['page'] = page
    res = requests.get(url=url,headers=headers,params=params)
    text_list = json.loads(res.text)
    value_list = text_list['data']
    for value in value_list:
        num_array.append(value['value'])

print(sum(num_array))
