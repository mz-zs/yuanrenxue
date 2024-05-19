const crypto = require('crypto-js')

var keyHex = crypto.enc.Utf8.parse(12345678)

function get_param(page) {
    params = {}
    code = (crypto.DES.encrypt(`${page}[[132,303,1129441.1999999997],[138,306,1317056.9999999995],[152,314,1391657.1999999997]]`, keyHex, {
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7
    }).toString())
    return code
}

function decrypt(key, message) {
    var keyHex = crypto.enc.Utf8.parse(key)
    code = (crypto.DES.decrypt(
        {
            ciphertext: crypto.enc.Base64.parse(message)
        }, keyHex, {
            mode: crypto.mode.ECB,
            padding: crypto.pad.Pkcs7
        }).toString())

    return code
}

console.log(decrypt('UyhuCmj1', 'paUXZEOkyD0Fmzj/sjsXd6kxFU07iMgOH8K9fGhxq3bqbcmidhzxg7xY6McjFVZzKrAovrFqzPQddb3zP/cbdXlz0IUD/WxLOcISHIo7OTAXmDwJbsPtIIBgl4WIDSge2DXHKcyQ/68VIkcuYBhekPsscg6qjR4k58INpNQ2ew6j/EvIRbxmVRKWwUdF9q60xNXVP+rIqFveFuoDFif+KzJ1xujeJZ33CxFeGF5TdEmGX2raPhhvhSqwKL6xasz0rp9oTBmgkcDXvJeEOLx5APmIrILvDChY'))