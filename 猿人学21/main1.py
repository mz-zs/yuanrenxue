from curl_cffi import requests

cookies = {
    '__51uvsct__3G5Pk0eEh7wEuiuP': '2',
    '__51vcke__3G5Pk0eEh7wEuiuP': 'ed50d5c5-30c3-5078-90c1-5937b26a3271',
    '__51vuft__3G5Pk0eEh7wEuiuP': '1706181855264',
    'Hm_lvt_434c501fe98c1a8ec74b813751d4e3e3': '1709822483,1710126057,1711615171',
    'Hm_lvt_c99546cf032aaa5a679230de9a95c7db': '1712052780,1712142142,1712146998,1712215282',
    'qpfccr': 'true',
    'no-alert3': 'true',
    'tk': '-2083600037053265305',
    'sessionid': '83a2anqxzxynoueaufia147y6cu7o8be',
    'Hm_lvt_9bcbda9cbf86757998a2339a0437208e': '1712052782,1712143627,1712147001,1712215290',
    'Hm_lpvt_9bcbda9cbf86757998a2339a0437208e': '1712215290',
    'Hm_lpvt_c99546cf032aaa5a679230de9a95c7db': '1712215306',
}

headers = {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    # 'cookie': '__51uvsct__3G5Pk0eEh7wEuiuP=2; __51vcke__3G5Pk0eEh7wEuiuP=ed50d5c5-30c3-5078-90c1-5937b26a3271; __51vuft__3G5Pk0eEh7wEuiuP=1706181855264; Hm_lvt_434c501fe98c1a8ec74b813751d4e3e3=1709822483,1710126057,1711615171; Hm_lvt_c99546cf032aaa5a679230de9a95c7db=1712052780,1712142142,1712146998,1712215282; qpfccr=true; no-alert3=true; tk=-2083600037053265305; sessionid=83a2anqxzxynoueaufia147y6cu7o8be; Hm_lvt_9bcbda9cbf86757998a2339a0437208e=1712052782,1712143627,1712147001,1712215290; Hm_lpvt_9bcbda9cbf86757998a2339a0437208e=1712215290; Hm_lpvt_c99546cf032aaa5a679230de9a95c7db=1712215306',
    'origin': 'https://match.yuanrenxue.cn',
    'pragma': 'no-cache',
    'referer': 'https://match.yuanrenxue.cn/match/21',
    'sec-ch-ua': '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
}

data = '\x87åÃ>Ö^\x84Û\xadª\x1dE>?ÓKàÑD\x8f\x87Âæ\a÷Oö\x13ï\x8e\x83´rÉ#Ç[\x8bR¥yã\aÁëï÷\x99:12!\x84ï{õîÈ\x0eÿ&\x04©\x8c²\x98ø¼!è¢\x12Tê°ï@\x85î@'.encode()

response = requests.post('https://match.yuanrenxue.cn/api/match/21', cookies=cookies, headers=headers, data=data,impersonate="edge101")
print(response.text)