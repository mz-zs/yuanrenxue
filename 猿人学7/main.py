import os

import requests
from fontTools.ttLib import TTFont
import json
import base64
from sklearn.neighbors import KNeighborsClassifier
import pandas as pd
from sklearn.impute import SimpleImputer
import numpy as np


def write_string_to_font_file(string, file_path):
    # 解码 Base64 字符串
    decoded_data = base64.b64decode(string)

    # 将二进制数据写入字体文件
    with open(file_path, 'wb') as file:
        file.write(decoded_data)


url = 'https://match.yuanrenxue.cn/api/match/7'
headers = {
    'User-Agent': 'yuanrenxue.project',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'https://match.yuanrenxue.cn/match/7',
    'Cookie': 'sessionid=d3aeeuu20xtynv5xo34u1is7tjniy8op',
}
params = {
}


font_list = [[] for _ in range(30)]
font = TTFont('./font/font.ttf')  # 打开当前目录的 movie.woff 文件
for arr in (list(font['glyf']['unic246'].coordinates)):
    font_list[0].append(arr[0])
    font_list[0].append(arr[1])
for arr in (list(font['glyf']['unic835'].coordinates)):
    font_list[1].append(arr[0])
    font_list[1].append(arr[1])
for arr in (list(font['glyf']['unib369'].coordinates)):
    font_list[2].append(arr[0])
    font_list[2].append(arr[1])
for arr in (list(font['glyf']['unia547'].coordinates)):
    font_list[3].append(arr[0])
    font_list[3].append(arr[1])
for arr in (list(font['glyf']['unib187'].coordinates)):
    font_list[4].append(arr[0])
    font_list[4].append(arr[1])
for arr in (list(font['glyf']['unib421'].coordinates)):
    font_list[5].append(arr[0])
    font_list[5].append(arr[1])
for arr in (list(font['glyf']['unic273'].coordinates)):
    font_list[6].append(arr[0])
    font_list[6].append(arr[1])
for arr in (list(font['glyf']['unia137'].coordinates)):
    font_list[7].append(arr[0])
    font_list[7].append(arr[1])
for arr in (list(font['glyf']['unib958'].coordinates)):
    font_list[8].append(arr[0])
    font_list[8].append(arr[1])
for arr in (list(font['glyf']['unic146'].coordinates)):
    font_list[9].append(arr[0])
    font_list[9].append(arr[1])

font = TTFont('./font/font1.ttf')  # 打开当前目录的 movie.woff 文件
for arr in (list(font['glyf']['unic871'].coordinates)):
    font_list[10].append(arr[0])
    font_list[10].append(arr[1])
for arr in (list(font['glyf']['unia138'].coordinates)):
    font_list[11].append(arr[0])
    font_list[11].append(arr[1])
for arr in (list(font['glyf']['unic463'].coordinates)):
    font_list[12].append(arr[0])
    font_list[12].append(arr[1])
for arr in (list(font['glyf']['unia218'].coordinates)):
    font_list[13].append(arr[0])
    font_list[13].append(arr[1])
for arr in (list(font['glyf']['unic764'].coordinates)):
    font_list[14].append(arr[0])
    font_list[14].append(arr[1])
for arr in (list(font['glyf']['unia352'].coordinates)):
    font_list[15].append(arr[0])
    font_list[15].append(arr[1])
for arr in (list(font['glyf']['unic839'].coordinates)):
    font_list[16].append(arr[0])
    font_list[16].append(arr[1])
for arr in (list(font['glyf']['unia158'].coordinates)):
    font_list[17].append(arr[0])
    font_list[17].append(arr[1])
for arr in (list(font['glyf']['unib598'].coordinates)):
    font_list[18].append(arr[0])
    font_list[18].append(arr[1])
for arr in (list(font['glyf']['unic548'].coordinates)):
    font_list[19].append(arr[0])
    font_list[19].append(arr[1])

font = TTFont('./font/font2.ttf')  # 打开当前目录的 movie.woff 文件
for arr in (list(font['glyf']['unia541'].coordinates)):
    font_list[20].append(arr[0])
    font_list[20].append(arr[1])
for arr in (list(font['glyf']['unic931'].coordinates)):
    font_list[21].append(arr[0])
    font_list[21].append(arr[1])
for arr in (list(font['glyf']['unic517'].coordinates)):
    font_list[22].append(arr[0])
    font_list[22].append(arr[1])
for arr in (list(font['glyf']['unic246'].coordinates)):
    font_list[23].append(arr[0])
    font_list[23].append(arr[1])
for arr in (list(font['glyf']['unic845'].coordinates)):
    font_list[24].append(arr[0])
    font_list[24].append(arr[1])
for arr in (list(font['glyf']['unic785'].coordinates)):
    font_list[25].append(arr[0])
    font_list[25].append(arr[1])
for arr in (list(font['glyf']['unic825'].coordinates)):
    font_list[26].append(arr[0])
    font_list[26].append(arr[1])
for arr in (list(font['glyf']['unia315'].coordinates)):
    font_list[27].append(arr[0])
    font_list[27].append(arr[1])
for arr in (list(font['glyf']['unic683'].coordinates)):
    font_list[28].append(arr[0])
    font_list[28].append(arr[1])
for arr in (list(font['glyf']['unib135'].coordinates)):
    font_list[29].append(arr[0])
    font_list[29].append(arr[1])

for i in range(0,30):
    font_list[i].insert(0, i % 10)

imputer = SimpleImputer(missing_values=np.nan, strategy='mean')
data = pd.DataFrame(imputer.fit_transform(pd.DataFrame(font_list)))
x = data.drop([0], axis=1)
y = data[0]

x_train = x.head(20)
y_train = y.head(20)
x_test = x.tail(10)
y_test = y.tail(10)

knn = KNeighborsClassifier(n_neighbors=1)
knn.fit(x_train, y_train)

LP = []
for page in range(1, 6):
    params['page'] = page
    re = requests.get(url, headers=headers, params=params)

    if re.status_code == 200:
        text = json.loads(re.text)
        woff = text['woff']
        write_string_to_font_file(woff, 'Temp_font.ttf')
        font1 = TTFont('./Temp_font.ttf')
        font1_list = {}
        font1_name = font1.getGlyphNames()
        font1_name = font1_name[1:]
        temp_list = [[] for _ in range(10)]
        for name in font1_name:
            font_aes = list(font1['glyf'][name].coordinates)
            for aes in font_aes:
                temp_list[font1_name.index(name)].append(aes[0])
                temp_list[font1_name.index(name)].append(aes[1])
        test_data = pd.DataFrame(imputer.fit_transform(pd.DataFrame(temp_list)))
        y_pre = knn.predict(test_data)
        i = 0
        while i <= 9:
            font1_list[font1_name[i]] = y_pre[i]
            i = i+1
        num_list = text['data']
        for num in num_list:
            temp_num = num['value'].split()
            temp_num = ['uni' + word[3:] for word in temp_num]
            sum_num = 0
            chengfang = 0
            for char in temp_num:
                chengfang = chengfang+1
                sum_num = sum_num + font1_list[char]*10**(len(temp_num)-chengfang)
            LP.append(sum_num)

    else:
        print('false')
hero_name = ['爷灬霸气傀儡', '梦战苍穹', '傲世哥', 'мaη肆風聲', '一刀メ隔世', '横刀メ绝杀', 'Q不死你R死你', '魔帝殤邪', '封刀不再战', '倾城孤狼', '戎马江湖', '狂得像风', '影之哀伤', '謸氕づ独尊', '傲视狂杀', '追风之梦', '枭雄在世', '傲视之巅', '黑夜刺客', '占你心为王', '爷来取你狗命', '御风踏血', '凫矢暮城', '孤影メ残刀', '野区霸王', '噬血啸月', '风逝无迹', '帅的睡不着', '血色杀戮者', '冷视天下', '帅出新高度', '風狆瑬蒗', '灵魂禁锢', 'ヤ地狱篮枫ゞ', '溅血メ破天', '剑尊メ杀戮', '塞外う飛龍', '哥‘K纯帅', '逆風祈雨', '恣意踏江山', '望断、天涯路', '地獄惡灵', '疯狂メ孽杀', '寂月灭影', '骚年霸称帝王', '狂杀メ无赦', '死灵的哀伤', '撩妹界扛把子', '霸刀☆藐视天下', '潇洒又能打', '狂卩龙灬巅丷峰', '羁旅天涯.', '南宫沐风', '风恋绝尘', '剑下孤魂', '一蓑烟雨', '领域★倾战', '威龙丶断魂神狙', '辉煌战绩', '屎来运赚', '伱、Bu够档次', '九音引魂箫', '骨子里的傲气', '霸海断长空', '没枪也很狂', '死魂★之灵'];

print(hero_name[LP.index(max(LP))])