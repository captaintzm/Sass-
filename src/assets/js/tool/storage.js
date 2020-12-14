/**
 * Created by Administrator on 2019/4/2.
 */

/** ****************** 通用方法 **********************/
function isJSON (str) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str)
      return obj
    } catch (e) {
      return str
    }
  }
}

function isString (str) {
  if (typeof str === 'string') {
    return str
  } else {
    return JSON.stringify(str)
  }
}

export function sessionSet (key, value) {
  sessionStorage.setItem(key, isString(value))
}

export function sessionGet (key) {
  return isJSON(sessionStorage.getItem(key))
}

export function localSet (key, value) {
  localStorage.setItem(key, isString(value))
}

export function localGet (key) {
  return isJSON(localStorage.getItem(key))
}

export function localRemove (key) {
  return localStorage.removeItem(key)
}

export function sessionRemove (key) {
  return sessionStorage.removeItem(key)
}

/** ****************** 制定key (便于全局修改key) **********************/

export function localSetOrgId (orgId) {
  localSet('orgId', orgId)
}

export function localGetOrgId () {
  return localGet('orgId')
}

export function localSetHideFlag (hideFlag) {
  localSet('hideFlag', hideFlag)
}

export function localGethideFlag () {
  return localGet('hideFlag')
}

export function localSetToken (token) {
  localSet('token', token)
}

export function localGetToken () {
  return localGet('token')
}

export function localSetHeaderToken (headerToken) {
  localSet('headerToken', headerToken)
}

export function localGetHeaderToken () {
  return localGet('headerToken')
}

export function localSetPageSiteId (siteId) {
  localSet('pageSiteId', siteId)
}

export function localGetPageSiteId () {
  return localGet('pageSiteId')
}
export function localGetSiteType () {
  return localGet('siteType')
}
export function localRemoveToken () {
  return localRemove('token')
}

export function localSetUser (user) {
  localSet('user', JSON.stringify(user))
}

export function localGetUser () {
  return localGet('user')
}

export function localSetSiteConfig (siteConfig) {
  localSet('siteConfig', siteConfig)
}

export function localGetSiteConfig () {
  return localGet('siteConfig')
}
