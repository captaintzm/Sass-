import axios from 'axios'
import apis from './apis'
import tools from '../tool/tools'
// import {
//   Toast
// } from 'vant'

axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})
axios.defaults.headers.common['token'] = localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId')

// let ToastIntance = null

axios.interceptors.response.use(
  function (response) {
    if (response.data.code === 401) {
      if (location.host === 'sc.ebaoton.cn') {
        location.href = location.origin + '/admin/#/login'
      } else {
        location.href = location.origin + '/backend_page/#/login'
      }
      localStorage.clear()
      sessionStorage.clear()
    }
    if (response.config.repeat) {
      // 弹出遮罩防重复
      // ToastIntance.clear()
    }
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.request.use(
  config => {
    // 是否需要请求状态码不为200时弹出提示
    config.warn = config.data && config.data.warn
    config.repeat = config.data && config.data.repeat
    // 判断是否存在token，如果存在将每个页面header都添加token
    config.headers.common['token'] = localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId')
    if (config.data && config.data.unFormData) {
      // 不需要formData格式的直接传json对象
      return config
    } else {
      config.data = tools.getFormData(config.data)
      return config
    }
  },
  error => {
    return Promise.reject(error.response)
  })

export async function cardyyzxcardInfoList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.cardyyzxcardInfoList, payload)
    return data
  } catch (e) {

  }
}

export async function listexport (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.listexport, payload)
    return data
  } catch (e) {

  }
}

export async function cardyyzxdetailById (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.cardyyzxdetailById, payload)
    return data
  } catch (e) {

  }
}

export async function cardyyzxcancle (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.cardyyzxcancle, payload)
    return data
  } catch (e) {

  }
}

export async function cardyyzxdelete (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.cardyyzxdelete, payload)
    return data
  } catch (e) {

  }
}

export async function cardyyzxsave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.cardyyzxsave, payload)
    return data
  } catch (e) {

  }
}

export async function cardyyzxsavedo (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.cardyyzxsavedo, payload)
    return data
  } catch (e) {

  }
}

export async function cardyyzxlist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.cardyyzxlist, payload)
    return data
  } catch (e) {

  }
}

export async function voucherlist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.voucherlist, payload)
    return data
  } catch (e) {

  }
}

export async function vouchernextPush (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.vouchernextPush, payload)
    return data
  } catch (e) {

  }
}

export async function voucherdistribute (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.voucherdistribute, payload)
    return data
  } catch (e) {

  }
}

export async function voucheractivied (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.voucheractivied, payload)
    return data
  } catch (e) {

  }
}

export async function vouchersave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.vouchersave, payload)
    return data
  } catch (e) {

  }
}

export async function voucherdelete (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.voucherdelete, payload)
    return data
  } catch (e) {

  }
}

export async function voucherdetailById (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.voucherdetailById, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfolist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfolist, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfosavedo (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfosavedo, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfolistBySource (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfolistBySource, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfodistribute (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfodistribute, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfoimportuser (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfoimportuser, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfoproductList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfoproductList, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfoselectProduct (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfoselectProduct, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfodelete (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfodelete, payload)
    return data
  } catch (e) {

  }
}

export async function packsinforemoveproduct (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinforemoveproduct, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfosaveselectpro (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfosaveselectpro, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfonextPush (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfonextPush, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfosave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfosave, payload)
    return data
  } catch (e) {

  }
}

export async function packsinfodetailById (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.packsinfodetailById, payload)
    return data
  } catch (e) {

  }
}

export async function userlist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.userlist, payload)
    return data
  } catch (e) {

  }
}

export async function grouplist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.grouplist, payload)
    return data
  } catch (e) {

  }
}

export async function voucherFlowList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.voucherFlowList, payload)
    return data
  } catch (e) {

  }
}

export async function uptPassword (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.uptPassword, payload)
    return data
  } catch (e) {

  }
}

export async function uspdate (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.uspdate, payload)
    return data
  } catch (e) {

  }
}

export async function userpacksList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.userpacksList, payload)
    return data
  } catch (e) {

  }
}

export async function userdetail (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.userdetail, payload)
    return data
  } catch (e) {

  }
}

export async function groupcreate (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.groupcreate, payload)
    return data
  } catch (e) {

  }
}

export async function mallist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.mallist, payload)
    return data
  } catch (e) {

  }
}

export async function usersave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.usersave, payload)
    return data
  } catch (e) {

  }
}

export async function userupdate (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.userupdate, payload)
    return data
  } catch (e) {

  }
}

export async function treelist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.treelist, payload)
    return data
  } catch (e) {

  }
}

export async function userinfo (payload = {}) {
  try {
    let {
      data
    } = await axios.get(apis.userinfo, {
      params: payload
    })
    return data
  } catch (e) {

  }
}

export async function roleselect (payload = {}) {
  try {
    let {
      data
    } = await axios.get(apis.roleselect, {
      params: payload
    })
    return data
  } catch (e) {

  }
}

export async function getMallinfo (payload = {}) {
  try {
    let {
      data
    } = await axios.get(apis.getMallinfo, {
      params: payload
    })
    return data
  } catch (e) {

  }
}
export async function getmallsave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.getmallsave, payload)
    return data
  } catch (e) {

  }
}
export async function upload (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.upload, payload)
    return data
  } catch (e) {

  }
}

export async function importuser (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.importuser, payload)
    return data
  } catch (e) {

  }
}

export async function mallsave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.mallsave, payload)
    return data
  } catch (e) {

  }
}

export async function list (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.list, payload)
    return data
  } catch (e) {

  }
}

export async function siteadvertsave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.siteadvertsave, payload)
    return data
  } catch (e) {

  }
}

export async function siteadvertdelete (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.siteadvertdelete, payload)
    return data
  } catch (e) {

  }
}
export async function siteadvertupdate (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.siteadvertupdate, payload)
    return data
  } catch (e) {

  }
}
export async function siteadvertinfo (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.siteadvertinfo, payload)
    return data
  } catch (e) {

  }
}
export async function queryLable (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryLable, payload)
    return data
  } catch (e) {

  }
}
export async function getStock (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.getStock, payload)
    return data
  } catch (e) {

  }
}
export async function queryProductCate (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryProductCate, payload)
    return data
  } catch (e) {

  }
}
export async function pick (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.pick, payload)
    return data
  } catch (e) {

  }
}
export async function siteSelect (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.siteSelect, payload)
    return data
  } catch (e) {

  }
}
export async function listBySource (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.listBySource, payload)
    return data
  } catch (e) {

  }
}

export async function queryMallDistrict (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryMallDistrict, payload)
    return data
  } catch (e) {

  }
}
export async function queryProductInOrg (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryProductInOrg, payload)
    return data
  } catch (e) {

  }
}
export async function prePick (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.prePick, payload)
    return data
  } catch (e) {

  }
}
export async function batchPrePick (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.batchPrePick, payload)
    return data
  } catch (e) {

  }
}
export async function batchInfo (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.batchInfo, payload)
    return data
  } catch (e) {

  }
}

export async function queryMySiteProduct (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryMySiteProduct, payload)
    return data
  } catch (e) {

  }
}

export async function ajaxUpdate (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.ajaxUpdate, payload)
    return data
  } catch (e) {

  }
}

export async function changeStatus (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.changeStatus, payload)
    return data
  } catch (e) {

  }
}

export async function batchUpdatePrice (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.batchUpdatePrice, payload)
    return data
  } catch (e) {

  }
}

export async function districtList (payload = {}) {
  try {
    let {
      data
    } = await axios.get(apis.districtList, {
      params: payload
    })
    return data
  } catch (e) {

  }
}

export async function mallSiteConfig (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.mallSiteConfig, payload)
    return data
  } catch (e) {

  }
}
export async function mallsiteupdate (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.mallsiteupdate, payload)
    return data
  } catch (e) {

  }
}
export async function mallfreightsave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.mallfreightsave, payload)
    return data
  } catch (e) {

  }
}
export async function mallfreightinfo (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.mallfreightinfo, payload)
    return data
  } catch (e) {

  }
}
export async function orderlist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.orderlist, payload)
    return data
  } catch (e) {

  }
}
export async function queryOrderDetail (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryOrderDetail, payload)
    return data
  } catch (e) {

  }
}
export async function listRechargeFlow (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.listRechargeFlow, payload)
    return data
  } catch (e) {

  }
}
export async function mallaccountexport (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.mallaccountexport, payload)
    return data
  } catch (e) {

  }
}
export async function myAccount (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.myAccount, payload)
    return data
  } catch (e) {

  }
}

export async function getThirdCateLevelListByLevelId (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.getThirdCateLevelListByLevelId, payload)
    return data
  } catch (e) {

  }
}
export async function logout (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.logout, payload)
    return data
  } catch (e) {

  }
}
export async function siteproductQuery (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.siteproductQuery, payload)
    return data
  } catch (e) {

  }
}
export async function getDetailByProductNo (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.getDetailByProductNo, payload)
    return data
  } catch (e) {

  }
}

export async function cardyyzxactived (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.cardyyzxactived, payload)
    return data
  } catch (e) {

  }
}
export async function photogallerylist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.photogallerylist, payload)
    return data
  } catch (e) {

  }
}
export async function userRecharg (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.userRecharg, payload)
    return data
  } catch (e) {

  }
}
export async function distributeBatchList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distributeBatchList, payload)
    return data
  } catch (e) {

  }
}
export async function distributelist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distributelist, payload)
    return data
  } catch (e) {

  }
}
export async function cardyyzxdistributeBatchList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.cardyyzxdistributeBatchList, payload)
    return data
  } catch (e) {

  }
}
export async function querySiteLable (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.querySiteLable, payload)
    return data
  } catch (e) {

  }
}
export async function queryProductCateBySite (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryProductCateBySite, payload)
    return data
  } catch (e) {

  }
}
export async function getThirdCateLevelListByLevelIdBySite (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.getThirdCateLevelListByLevelIdBySite, payload)
    return data
  } catch (e) {

  }
}
export async function sysuserinfo (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.sysuserinfo, payload)
    return data
  } catch (e) {

  }
}
export async function cardyyzxdistributelist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.cardyyzxdistributelist, payload)
    return data
  } catch (e) {

  }
}
export async function realPrice (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.realPrice, payload)
    return data
  } catch (e) {

  }
}
export async function jumpAdmin (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.jumpAdmin, payload)
    return data
  } catch (e) {

  }
}

export async function menuinfo (payload = {}) {
  try {
    let {
      data
    } = await axios.get(apis.menuinfo, {
      params: payload
    })
    return data
  } catch (e) {

  }
}

export async function saasmerchantinfolist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.saasmerchantinfolist, payload)
    return data
  } catch (e) {

  }
}
export async function saasmerchantinfosave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.saasmerchantinfosave, payload)
    return data
  } catch (e) {

  }
}
export async function saasmerchantflowlist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.saasmerchantflowlist, payload)
    return data
  } catch (e) {

  }
}
export async function editMerchantInfo (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.editMerchantInfo, payload)
    return data
  } catch (e) {

  }
}
export async function batchSelectBySkus (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.batchSelectBySkus, payload)
    return data
  } catch (e) {

  }
}
export async function siteadvertbatchSelectBySkus (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.siteadvertbatchSelectBySkus, payload)
    return data
  } catch (e) {

  }
}
export async function siteadvertbatchPick (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.siteadvertbatchPick, payload)
    return data
  } catch (e) {

  }
}
export async function distUserlist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distUserlist, payload)
    return data
  } catch (e) {

  }
}
export async function getAuditManager (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.getAuditManager, payload)
    return data
  } catch (e) {

  }
}
export async function distUsersave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distUsersave, payload)
    return data
  } catch (e) {

  }
}
export async function distUserupdate (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distUserupdate, payload)
    return data
  } catch (e) {

  }
}
export async function isOpenTransfer (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.isOpenTransfer, payload)
    return data
  } catch (e) {

  }
}
export async function distRulelist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distRulelist, payload)
    return data
  } catch (e) {

  }
}
export async function distRulesave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distRulesave, payload)
    return data
  } catch (e) {

  }
}
export async function distRuleupdate (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distRuleupdate, payload)
    return data
  } catch (e) {

  }
}

export async function distBudgetlist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distBudgetlist, payload)
    return data
  } catch (e) {

  }
}
export async function distBudgetrecharge (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distBudgetrecharge, payload)
    return data
  } catch (e) {

  }
}
export async function flowList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.flowList, payload)
    return data
  } catch (e) {}
}
export async function queryDistList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryDistList, payload)
    return data
  } catch (e) {}
}
export async function roledelete (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.roledelete, payload)
    return data
  } catch (e) {}
}
export async function rolesiteSelect (payload = {}) {
  try {
    let {
      data
    } = await axios.get(apis.rolesiteSelect, {
      params: payload
    })
    return data
  } catch (e) {

  }
}

export async function sysmenulist (payload = {}) {
  try {
    let {
      data
    } = await axios.get(apis.sysmenulist, {
      params: payload
    })
    return data
  } catch (e) {

  }
}
export async function rolesave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.rolesave, payload)
    return data
  } catch (e) {}
}
export async function roleupdate (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.roleupdate, payload)
    return data
  } catch (e) {}
}
export async function siteDelete (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.siteDelete, payload)
    return data
  } catch (e) {}
}
export async function rolesiteInfo (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.rolesiteInfo, payload)
    return data
  } catch (e) {}
}
export async function importDistUser (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.importDistUser, payload)
    return data
  } catch (e) {}
}
export async function batchRemove (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.batchRemove, payload)
    return data
  } catch (e) {}
}
export async function siteproductstocksave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.siteproductstocksave, payload)
    return data
  } catch (e) {}
}
export async function userpassword (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.userpassword, payload)
    return data
  } catch (e) {}
}

export async function getSNDistrict (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.getSNDistrict, payload)
    return data
  } catch (e) {}
}

export async function saveSNDistrict (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.saveSNDistrict, payload)
    return data
  } catch (e) {}
}
export async function seckillInfolist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.seckillInfolist, payload)
    return data
  } catch (e) {}
}
export async function uptOperStatus (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.uptOperStatus, payload)
    return data
  } catch (e) {}
}
export async function seckillInfosave (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.seckillInfosave, payload)
    return data
  } catch (e) {}
}
export async function seckillInfodetail (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.seckillInfodetail, payload)
    return data
  } catch (e) {}
}
export async function distBugetReportlist (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distBugetReportlist, payload)
    return data
  } catch (e) {}
}
export async function approvalDetails (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.approvalDetails, payload)
    return data
  } catch (e) {}
}
export async function queryDistRuleList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryDistRuleList, payload)
    return data
  } catch (e) {}
}
export async function ffdistributeList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.ffdistributeList, payload)
    return data
  } catch (e) {}
}
export async function distributeDetails (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.distributeDetails, payload)
    return data
  } catch (e) {}
}
export async function querySupplyList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.querySupplyList, payload)
    return data
  } catch (e) {}
}
export async function queryApiInvoicesListPage (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryApiInvoicesListPage, payload)
    return data
  } catch (e) {}
}
export async function invoiceConfirm (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.invoiceConfirm, payload)
    return data
  } catch (e) {}
}
export async function queryApiInvoicesInfoById (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryApiInvoicesInfoById, payload)
    return data
  } catch (e) {}
}
export async function queryInvoicesOrderDetailList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryInvoicesOrderDetailList, payload)
    return data
  } catch (e) {}
}
export async function logisticsConfirm (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.logisticsConfirm, payload)
    return data
  } catch (e) {}
}
export async function saveOrUpdateLogistics (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.saveOrUpdateLogistics, payload)
    return data
  } catch (e) {}
}
export async function queryComList (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryComList, payload)
    return data
  } catch (e) {}
}
export async function queryLogistics (payload = {}) {
  try {
    let {
      data
    } = await axios.post(apis.queryLogistics, payload)
    return data
  } catch (e) {}
}
