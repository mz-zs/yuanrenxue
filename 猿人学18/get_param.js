const crypto = require('crypto-js')

function get_params(page) {
    mingwen = page + '|231m269,230m269,230d269,230m268,230u268'
    console.log(mingwen)
    timestamp = Math.round(new Date().getTime() / 1000);
    console.log(timestamp.toString(16)+timestamp.toString(16))
    const key = crypto.enc.Utf8.parse(timestamp.toString(16)+timestamp.toString(16))
    const iv = crypto.enc.Utf8.parse(timestamp.toString(16)+timestamp.toString(16))

    return {
        'page': page,
        't': timestamp,
        'v': crypto.AES.encrypt(mingwen, key, {
            iv: iv,
            mode: crypto.mode.CBC,
            padding: crypto.pad.Pkcs7
        }).toString()
    }
}

console.log(get_params(3))