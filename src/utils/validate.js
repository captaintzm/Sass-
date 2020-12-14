/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}
/**
 * 密码改成字母+数字6位
 * @param {*} s
 */
export function isPassword (s) {
  return /^[0-9a-zA-Z]+$/.test(s)
}
/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

export function checkToPrice (price) {
  if (price !== '') {
    var eg = /^((0|[1-9])\d*)(\.\d+)?$/
    if (eg.test(price) && price !== '') {
      price = parseFloat(price).toFixed(2)
    } else {
      price = ''
    }
    return price
  }
}
