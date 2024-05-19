import httpx
import json

client = httpx.Client(http2=True)

headers = {
    'cookie': 'Hm_lvt_434c501fe98c1a8ec74b813751d4e3e3=1708354050; __51uvsct__3G5Pk0eEh7wEuiuP=2; __51vcke__3G5Pk0eEh7wEuiuP=ed50d5c5-30c3-5078-90c1-5937b26a3271; __51vuft__3G5Pk0eEh7wEuiuP=1706181855264; qpfccr=true; Hm_lvt_c99546cf032aaa5a679230de9a95c7db=1709120669,1709171102,1709187452,1709193285; no-alert3=true; tk=5643636071853415652; sessionid=59k4nxubqxr60zfgg2rz91lrhqp9u5jk; Hm_lvt_9bcbda9cbf86757998a2339a0437208e=1709120720,1709171109,1709187459,1709193293; Hm_lpvt_9bcbda9cbf86757998a2339a0437208e=1709193293; Hm_lpvt_c99546cf032aaa5a679230de9a95c7db=1709193545'
}
# cookie = {
#     'sessionid': '59k4nxubqxr60zfgg2rz91lrhqp9u5jk'
# }

params = {}
value_arr = []
for page in range(1, 6):
    url = f'https://match.yuanrenxue.cn/api/match/17?page={page}'
    res = client.get(url=url, headers=headers)
    print(res.text)
    value_list = json.loads(res.text)['data']
    for value in value_list:
        value_arr.append(value['value'])

print(sum(value_arr))
