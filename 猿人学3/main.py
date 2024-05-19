import requests

page_list = [1, 2, 3, 4, 5]
num_list = []
for i in page_list:
    url = f'https://match.yuanrenxue.cn/api/match/3?page={i}'
    headers = {
        "Host": "match.yuanrenxue.cn",
        "Connection": "keep-alive",
        "Content-Length": "0",
        "sec-ch-ua": '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
        "sec-ch-ua-platform": '"Windows"',
        "Accept": "*/*",
        "Origin": "https://match.yuanrenxue.cn",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://match.yuanrenxue.cn/match/3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en,zh-CN;q=0.9,zh;q=0.8",

    }
    cookie = {
        'sessionid':'39wwo3lcftay53kuof8i5phdfjegfv34'
    }
    session = requests.session()
    session.headers = headers
    url_cookie = 'https://match.yuanrenxue.cn/jssm'
    response = session.post(url_cookie, cookies=cookie)
    print(session.cookies)
    re = session.get(url)
    re = re.json()
    print(re)
    value = re['data']
    for ii in range(0,len(value)):
        num_list.append(value[ii]['value'])
print(num_list)
print(max(set(num_list),key=num_list.count))
