const crypto = require('crypto-js')

var keyHex = crypto.enc.Utf8.parse(12345678)

function get_param(page) {
    params = {}
    code = (crypto.DES.encrypt(`${page}[[167,306,818018],[129,312,827386.3000000119],[117,302,2713097.400000006]]`, keyHex, {
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7
    }).toString())
    var binaryData = atob(code)

// 创建一个与二进制数据长度相等的 ArrayBuffer
    var arrayBuffer = new ArrayBuffer(binaryData.length);

// 创建一个 Uint8Array 来处理 ArrayBuffer
    var uint8Array = new Uint8Array(arrayBuffer);

// 将二进制数据填充到 Uint8Array 中
    for (var i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
    }

// 现在你可以使用 arrayBuffer 来处理二进制数据了

    params[binaryData] = arrayBuffer
    return params
}

console.log(get_param(1))