var iv = "FF245C99227E6B2EFE7510B35DD3D137";
var SALT = "3FF2EC0C9C6B7B945225DEBAD71A01B6965FE84C95A70EB132A82F88C0A59A55";
var PASSPHRASE = "AB33T33##aasd*93339+_2";
var AesUtil = function(b, a) {
    this.keySize = b / 32;
    this.iterationCount = a
};
AesUtil.prototype.generateKey = function(b, c) {
    var a = CryptoJS.PBKDF2(c, CryptoJS.enc.Hex.parse(b), {
        keySize: this.keySize,
        iterations: this.iterationCount
    });
    return a
}
;
AesUtil.prototype.encrypt = function(d, a, f, c) {
    var b = this.generateKey(d, f);
    var e = CryptoJS.AES.encrypt(c, b, {
        iv: CryptoJS.enc.Hex.parse(a)
    });
    return e.ciphertext.toString(CryptoJS.enc.Base64)
}
;
AesUtil.prototype.decrypt = function(f, c, g, e) {
    var d = this.generateKey(f, g);
    var b = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(e)
    });
    var a = CryptoJS.AES.decrypt(b, d, {
        iv: CryptoJS.enc.Hex.parse(c)
    });
    return a.toString(CryptoJS.enc.Utf8)
}
;
function aesEncode(a) {
    var c = new AesUtil(128,800);
    var b = c.encrypt(SALT, iv, PASSPHRASE, a);
    return b
}
function aesDecode(a) {
    var c = new AesUtil(128,800);
    var b = c.decrypt(SALT, iv, PASSPHRASE, a);
    return b
};
