import requests
import pic
import json
import re
from lxml import etree
import numpy as np
import statistics


def answer():
    answer = str()
    key = input('请输入')
    answer = answer + button[key] +'|'
    key = input('请输入')
    answer = answer + button[key] +'|'
    key = input('请输入')
    answer = answer + button[key] +'|'
    key = input('请输入')
    answer = answer + button[key] +'|'
    return answer


button = {'1': '155', '2': '165', '3': '175',
          '4': '455', '5': '465', '6': '475',
          '7': '755', '8': '765', '9': '775'}

url = 'https://match.yuanrenxue.cn/api/match/8'
url_verify = 'https://match.yuanrenxue.cn/api/match/8_verify'
headers = {
    'Referer': 'https://match.yuanrenxue.cn/match/8',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/\
118.0.0.0 Safari/537.36 Edg/118.0.2088.76',
    'Cookie': 'sessionid=rkc0o6ej0hl6ovdhtttb8tl1r0if8726;tk=7542132062870355751',
    'Host': 'match.yuanrenxue.cn'
}
params = {}
data = []
for page in range(1,6):
    res = requests.get(url_verify, headers=headers)
    html = json.loads(res.text)
    html = html['html']
    code_begin = html.find('base64,')
    code_end = html.find('alt=')
    code = html[code_begin + 7:code_end - 2]
    # 读取图片base64代码
    character = html.find('<p>')
    print(html[62:62 + 44])
    # 显示哪四个字
    pic.get_jpeg(code)
    mask, h, w = pic.background('./pic.jpeg')
    mask = pic.remove_line(mask, h, w)
    erode_img = pic.erode(mask)
    params['answer'] = answer()
    params['page'] = page
    re = requests.get(url, params=params, headers=headers)
    text = json.loads(re.text)
    print(text)
    text = text['data']
    for value in text:
        data.append(value['value'])

print(statistics.mode(data))




