import cv2
import numpy as np
import matplotlib.pyplot as plt
import base64


def get_jpeg(code):
    with open('./pic.jpeg', 'wb') as f:
        decoded = base64.b64decode(code)
        f.write(decoded)


def read_code(path):
    with open(path, 'r') as f:
        code = f.read()
    return code


def background(road):
    im = cv2.imread(road)
    h, w = im.shape[0:2]
    im[np.all(im == (0, 0, 0), axis=-1)] = [255, 255, 255]
    colors, counts = np.unique(np.array(im).reshape(-1, 3), axis=0, return_counts=True)
    info_dict = {counts[i]: colors[i].tolist() for i, v in enumerate(counts) if 500 < int(v) < 2200}
    remove_background_rgbs = info_dict.values()
    mask = np.zeros((h, w, 3), np.uint8) + 255  # 生成一个全是白色的图片
    # 通过循环将不是噪点的像素,赋值给一个白色的图片,最后到达移除背景图片的效果
    for rgb in remove_background_rgbs:
        mask[np.all(im == rgb, axis=-1)] = im[np.all(im == rgb, axis=-1)]
    #cv2.imshow('', mask)
    #cv2.waitKey(0)
    return mask, h, w


def remove_line(mask, h, w):
    # 去掉线条,全部像素黑白化
    line_list = []  # 首先创建一个空列表,用来存放出现在间隔当中的像素点
    # 两个for循环,遍历9000次
    for y in range(h):
        for x in range(w):
            tmp = mask[x, y].tolist()
            if tmp != [0, 0, 0]:
                if 110 < y < 120 or 210 < y < 220:
                    line_list.append(tmp)
                if 100 < x < 110 or 200 < x < 210:
                    line_list.append(tmp)
    remove_line_rgbs = np.unique(np.array(line_list).reshape(-1, 3), axis=0)
    for rgb in remove_line_rgbs:
        mask[np.all(mask == rgb, axis=-1)] = [255, 255, 255]
    # np.any()函数用于判断整个数组中的元素至少有一个满足条件就返回True，否则返回False。
    mask[np.any(mask != [255, 255, 255], axis=-1)] = [0, 0, 0]
    #cv2.imshow("Image with lines removed", mask)  # 移除了线条的图片
    #cv2.waitKey(0)
    return mask


def erode(mask):
    # 腐蚀
    # 卷积核涉及到python形态学处理的知识,感兴趣的可以自行百度
    # 生成一个2行三列数值全为1的二维数字,作为腐蚀操作中的卷积核
    kernel = np.ones((2, 3), 'uint8')
    # iterations 迭代的次数,也就是进行多少次腐蚀操作
    erode_img = cv2.erode(mask, kernel, iterations=2)
    cv2.imshow('Eroded Image', erode_img)
    # cv2.imwrite('deal.png', erode_img) #这行代码可以保存处理的图片
    # cv2.waitKey()等待键盘输入，为毫秒级
    # cv2.waitKey()防止图片一闪而过
    cv2.waitKey(0)
    return erode_img





