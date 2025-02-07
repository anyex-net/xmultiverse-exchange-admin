import  CryptoJS from "crypto-js"
// 加密
export const encrypt=(data:string, secretKey?:string)=>{
    const utf8Data = CryptoJS.enc.Utf8.parse(data)
    const utf8SecretKey = CryptoJS.enc.Utf8.parse(secretKey || 'Lz2V8dSLxFHJ9Nvk')
    const encrypted = CryptoJS.AES.encrypt(utf8Data, utf8SecretKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.toString()
}
// 解密
export const decrypt=(data:string, secretKey?:string)=>{
    const utf8SecretKey = CryptoJS.enc.Utf8.parse(secretKey || 'Lz2V8dSLxFHJ9Nvk')
    const decrypt = CryptoJS.AES.decrypt(data, utf8SecretKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}