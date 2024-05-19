import base64

def write_string_to_font_file(string, file_path):
    # 解码 Base64 字符串
    decoded_data = base64.b64decode(string)

    # 将二进制数据写入字体文件
    with open(file_path, 'wb') as file:
        file.write(decoded_data)

# 示例字符串
base64_string = "SGVsbG8gV29ybGQh"

# 字体文件路径
font_file_path = "font.ttf"

# 将字符串写入为字体文件
write_string_to_font_file(base64_string, font_file_path)