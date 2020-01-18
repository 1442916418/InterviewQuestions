/**
 *  正则验证
 */

// 验证空字符串
function verifyEmptyString(value) {
    return value.replace(/(^s*)|(s*$)/g, "").length == 0 ? false : true;
}

// 验证字符串长度
function verifyStringlength(value) {
    return value.length < 6 ? false : true;
}

// 验证 IP + 端口
function verifyIPAndPort(value) {
    let patt = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\:(\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/g;
    if (patt.test(value)) {
        return true;
    } else {
        return false;
    }
}

// 验证是否为 0
function verifyIs0(value) {
    return value === 0 ? false : true;
}

// 验证是否为空
function verifyIsNull(value) {
    if (value === "" || value === null || value === undefined) {
        return false;
    } else {
        return true;
    }
}

// 验证中文、大小写字母、数字
function isFullwidthChar(value) {
    let reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/g;
    return reg.test(value);
}

export default {
    verifyEmptyString, verifyStringlength, verifyIPAndPort, verifyIs0, verifyIsNull,
    isFullwidthChar
};