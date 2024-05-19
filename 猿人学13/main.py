import requests
import re
import json

url1 = 'https://match.yuanrenxue.cn/match/13'

cookie = {
    '__51uvsct__3G5Pk0eEh7wEuiuP': '2',
    '__51vcke__3G5Pk0eEh7wEuiuP': 'ed50d5c5-30c3-5078-90c1-5937b26a3271',
    '__51vuft__3G5Pk0eEh7wEuiuP': '1706181855264',
    'no-alert3': 'true',
    'sessionid': 'juplnwpo4igtf04d01bwt98jjecv045z',
    'Hm_lpvt_9bcbda9cbf86757998a2339a0437208e': '1708514465',
    'Hm_lvt_9bcbda9cbf86757998a2339a0437208e': '1706514175,1708408237,1708442655,1708514465',
    'Hm_lvt_c99546cf032aaa5a679230de9a95c7db': '1706514173,1708408235,1708442647,1708514463',
    'Hm_lvt_434c501fe98c1a8ec74b813751d4e3e3': '1708354050'
}

headers = {
    'Referer': 'https://match.yuanrenxue.cn/match/13',
    'User-Agent': 'yuanrenxue.project',
    'Host': 'match.yuanrenxue.cn',
    'X-Requested-With': 'XMLHttpRequest'
}
session = requests.session()
yuanrenxue_cookie_text = session.get(url1, headers=headers, cookies=cookie).text
first_process_text = re.findall('\(\'.\'\)', yuanrenxue_cookie_text)
second_process_text = re.findall('[^()\']', ''.join(first_process_text))
finnal_process_text = ''.join(second_process_text)
array_cookie_text = finnal_process_text.split('=', 1)
params = {
}
cookie[array_cookie_text[0]] = array_cookie_text[1]
num_array = []
for page in range(1, 6):
    params['page'] = page
    url2 = 'https://match.yuanrenxue.cn/api/match/13'
    session.cookies.set(array_cookie_text[0], array_cookie_text[1])
    res = session.get(url2, headers=headers, params=params)
    res_text = json.loads(res.text)['data']
    for data in res_text:
        num_array.append(data['value'])
        print(data['value'])
print(sum(num_array))
