const apis = {
  getMallinfo: '/ybt-backend/mall/mallsite/info', // 获取商城信息
  getmallsave: '/ybt-backend/mall/mallsite/save', // 新增商城
  upload: '/ybt-backend/sys/oss/upload', // 上传
  list: '/ybt-backend/site/siteadvert/list', // 专题列表
  siteadvertsave: '/ybt-backend/site/siteadvert/save', // 新增专题
  siteadvertupdate: '/ybt-backend/site/siteadvert/update', // 修改专题
  siteadvertdelete: '/ybt-backend/site/siteadvert/deleteById', // 删除专题
  siteadvertinfo: '/ybt-backend/site/siteadvert/info', // 专题详情信息
  queryLable: '/ybt-backend/product/product/queryLable', // 获取标签列表
  getStock: '/ybt-backend/product/product/getStock', // 搜索库存
  queryProductCate: '/ybt-backend/product/product/queryProductCate', // 获取商品分类
  getThirdCateLevelListByLevelId: '/ybt-backend/product/product/getThirdCateLevelListByLevelId', // 分类
  pick: '/ybt-backend/site/siteadvert/pick', // 挑选商品
  siteSelect: '/ybt-backend/product/siteproduct/select', // 选择商品
  listBySource: '/ybt-backend/district/district/listBySource', // 根据来源获取地址列表
  queryMallDistrict: '/ybt-backend/mall/mallsite/queryMallDistrict', // 获取商城地址
  queryProductInOrg: '/ybt-backend/product/siteproduct/queryProductInOrg', // 搜索机构商品
  prePick: '/ybt-backend/product/siteproduct/prePick', // 挑选商品
  batchPrePick: '/ybt-backend/product/siteproduct/batchPrePick', // 批量挑选商品
  batchInfo: '/ybt-backend/product/siteproduct/batchInfo', // 批量搜索商品
  queryMySiteProduct: '/ybt-backend/product/siteproduct/queryMySiteProduct', // 搜索机构商品
  ajaxUpdate: '/ybt-backend/product/siteproduct/ajaxUpdate', // 改价
  changeStatus: '/ybt-backend/product/siteproduct/changeStatus', // 操作商品上下架
  batchUpdatePrice: '/ybt-backend/product/siteproduct/batchUpdatePrice', // 批量改价
  districtList: '/ybt-backend/district/district/list', // 地址
  treelist: '/ybt-backend/sys/sysorganization/treelist', // 机构数列表
  userlist: '/ybt-backend/sys/user/mall/list', // 账号数据列表
  userinfo: '/ybt-backend/sys/user/mall/info/', // 权限
  roleselect: '/ybt-backend/sys/role/select',
  usersave: '/ybt-backend/sys/user/mall/save', // 新增账号
  userupdate: '/ybt-backend/sys/user/mall/update', // 更新账号
  mallist: '/ybt-backend/mall/mallsite/user/list',
  groupcreate: '/ybt-backend/mall/mallsite/group/create',
  grouplist: '/ybt-backend/mall/mallsite/group/list',
  mallsave: '/ybt-backend/mall/mallsite/user/save',
  importuser: '/ybt-backend/mall/mallsite/user/import',
  mallSiteConfig: '/ybt-backend/mall/mallsite/mallSiteConfig', // 站点配置
  mallsiteupdate: '/ybt-backend/mall/mallsite/update', // 登录页修改
  mallfreightsave: '/ybt-backend/mall/mallfreight/save', // 保存运费配置
  mallfreightinfo: '/ybt-backend/mall/mallfreight/list', // 运费详情
  orderlist: '/ybt-backend/order/order/list', // 订单列表
  queryOrderDetail: '/ybt-backend/order/order/queryOrderDetail', // 订单详情
  listRechargeFlow: '/ybt-backend/finance/mallaccount/listRechargeFlow', // 交易明细
  mallaccountexport: '/ybt-backend/finance/mallaccount/export', // 交易明细导出
  myAccount: '/ybt-backend/finance/mallaccount/myAccount', // 搜索商城账户额度
  userdetail: '/ybt-backend/mall/mallsite/user/detail', // 会员详情
  voucherFlowList: '/ybt-backend/mall/mallsite/user/voucherFlowList',
  userpacksList: '/ybt-backend/mall/mallsite/user/packsList',
  uspdate: '/ybt-backend/mall/mallsite/user/update',
  uptPassword: '/ybt-backend/sys/user/uptPassword',
  packsinfolist: '/ybt-backend/packsinfo/packsinfo/list', // 礼包列表
  packsinfodetailById: '/ybt-backend/packsinfo/packsinfo/detailById', // 礼包详情
  packsinfosave: '/ybt-backend/packsinfo/packsinfo/save', // 礼包保存
  packsinfosavedo: '/ybt-backend/packsinfo/packsinfo/savedo', // 礼包来源
  packsinfonextPush: '/ybt-backend/packsinfo/packsinfo/nextPush', // 礼包下一步
  packsinfosaveselectpro: '/ybt-backend/packsinfo/packsinfo/saveselectpro', // 挑选商品
  packsinforemoveproduct: '/ybt-backend/packsinfo/packsinfo/removeproduct', // 移除商品
  packsinfoselectProduct: '/ybt-backend/packsinfo/packsinfo/selectProduct', // 可选商品
  packsinfoproductList: '/ybt-backend/packsinfo/packsinfo/productList', // 已选商品
  packsinfoimportuser: '/ybt-backend/packsinfo/packsinfo/importuser', // 礼包批量导入
  packsinfodistribute: '/ybt-backend/packsinfo/packsinfo/distribute', // 礼包分发
  packsinfolistBySource: '/ybt-backend/packsinfo/packsinfo/listBySource', // 礼包分发
  packsinfodelete: '/ybt-backend/packsinfo/packsinfo/delete', // 礼包删除
  voucherlist: '/ybt-backend/voucher/voucher/list', // 积分列表
  voucherdetailById: '/ybt-backend/voucher/voucher/detailById', // 积分详情
  voucherdelete: '/ybt-backend/voucher/voucher/delete', // 积分移除
  vouchersave: '/ybt-backend/voucher/voucher/save', // 积分保存
  vouchernextPush: '/ybt-backend/voucher/voucher/nextPush', // 积分保存
  voucheractivied: '/ybt-backend/voucher/voucher/activied', // 积分激活
  voucherdistribute: '/ybt-backend/voucher/voucher/distribute', // 积分激活
  cardyyzxlist: '/ybt-backend/card/cardyyzx/list', // 卡券列表
  cardyyzxsave: '/ybt-backend/card/cardyyzx/save', // 卡券创建
  cardyyzxsavedo: '/ybt-backend/card/cardyyzx/savedo', // 卡券来源
  cardyyzxcancle: '/ybt-backend/card/cardyyzx/cancle', // 卡券挑选商品
  cardyyzxdetailById: '/ybt-backend/card/cardyyzx/detailById', // 卡券详情
  cardyyzxcardInfoList: '/ybt-backend/card/cardyyzx/cardInfoList', // 卡券详情
  logout: '/ybt-backend/sys/logout',
  sysuserinfo: '/ybt-backend/sys/user/info',
  siteproductQuery: '/ybt-backend/product/siteproduct/query', // 查询商品详情
  cardyyzxdelete: '/ybt-backend/card/cardyyzx/delete', // 删除卡券
  getDetailByProductNo: '/ybt-backend/product/product/getDetailByProductNo', // 获取自有商品 商品详情
  listexport: '/ybt-backend/mall/mallsite/user/list/export', // 会员导出
  cardyyzxactived: '/ybt-backend/card/cardyyzx/actived', // 激活
  photogallerylist: '/ybt-backend/photo/photogallery/list', // 图片库列表
  cardlistexport: '/ybt-backend/card/cardyyzx/cardlistexport', // 卡片导出
  userRecharg: '/ybt-backend/mall/mallsite/user/recharge', // 会员充值
  distributeBatchList: '/ybt-backend/packsinfo/packsinfo/distributeBatchList', // 白名单发放记录
  cardyyzxdistributeBatchList: '/ybt-backend/card/cardyyzx/distributeBatchList', // 卡券分发记录
  distributelist: '/ybt-backend/packsinfo/packsinfo/distributelist', // 本批次下的分发记录
  querySiteLable: '/ybt-backend/product/product/querySiteLable', // 获取站点标签列表 我的商品库
  queryProductCateBySite: '/ybt-backend/product/product/queryProductCateBySite', // 商城获取二级分类 我的商品库
  getThirdCateLevelListByLevelIdBySite: '/ybt-backend/product/product/getThirdCateLevelListByLevelIdBySite', // 商城获取三级分类 我的商品库
  cardyyzxdistributelist: '/ybt-backend/card/cardyyzx/distributelist', // 兑换卡券激活
  realPrice: '/ybt-backend/product/siteproduct/realPrice', // 查看京东商品实时价格
  distributelistExport: '/ybt-backend/card/cardyyzx/distributelistExport', // 卡券导出本批次下的分发记录
  jumpAdmin: '/ybt-backend/market/jumpAdmin', // 跳转营销活动
  menuinfo: '/ybt-backend/sys/user/info',
  saasmerchantinfolist: '/ybt-backend/merchant/saasmerchantinfo/list',
  saasmerchantinfosave: '/ybt-backend/merchant/saasmerchantinfo/save',
  saasmerchantflowlist: '/ybt-backend/merchant/saasmerchantflow/list',
  editMerchantInfo: '/ybt-backend/merchant/saasmerchantinfo/editMerchantInfo',
  batchSelectBySkus: '/ybt-backend/mall/mallsite/batchSelectBySkus',
  siteadvertbatchSelectBySkus: '/ybt-backend/site/siteadvert/batchSelectBySkus',
  siteadvertbatchPick: '/ybt-backend/site/siteadvert/batchPick',
  distUserlist: '/ybt-backend/api/distUser/list', // 分发用户列表
  getAuditManager: '/ybt-backend/api/distUser/getAuditManager', // 下拉框获取审批人信息
  distUsersave: '/ybt-backend/api/distUser/save', // 新增分发用户
  distUserupdate: '/ybt-backend/api/distUser/update', // 修改分发用户
  isOpenTransfer: '/ybt-backend/api/distRule/isOpenTransfer', // 是否开启逐级划拨
  distRulelist: '/ybt-backend/api/distRule/list', // 分发规则列表
  distRulesave: '/ybt-backend/api/distRule/save', // 新增分发规则
  distRuleupdate: '/ybt-backend/api/distRule/update', // 修改分发规则
  distBudgetlist: '/ybt-backend/api/distBudget/list', // 预算划拨列表
  distBudgetrecharge: '/ybt-backend/api/distBudget/recharge', // 充值
  flowList: '/ybt-backend/api/distBudget/flowList', // 预算划拨流水列表
  queryDistList: '/ybt-backend/api/distBudget/queryDistList',
  rolesiteSelect: '/ybt-backend/sys/role/siteSelect',
  sysmenulist: '/ybt-backend/sys/menu/siteMenuList',
  roledelete: '/ybt-backend/sys/role/delete',
  rolesave: '/ybt-backend/sys/role/save',
  roleupdate: '/ybt-backend/sys/role/update',
  siteDelete: '/ybt-backend/sys/role/siteDelete',
  rolesiteInfo: '/ybt-backend/sys/role/siteInfo',
  importDistUser: '/ybt-backend/api/distUser/importDistUser',
  batchRemove: '/ybt-backend/product/siteproduct/batchRemove',
  siteproductstocksave: '/ybt-backend/siteproductstock/save',
  userpassword: '/ybt-backend/sys/user/password',
  getSNDistrict: '/ybt-backend/mall/mallsite/getSNDistrict', // 获取苏宁易购地址
  saveSNDistrict: '/ybt-backend/mall/mallsite/saveSNDistrict', // 保存苏宁易购地址
  seckillInfolist: '/ybt-backend/org/marketinfo/seckillInfo/list', // 限时特惠列表
  uptOperStatus: '/ybt-backend/org/marketinfo/seckillInfo/uptOperStatus', // 限时特惠修改状态
  seckillInfosave: '/ybt-backend/org/marketinfo/seckillInfo/save', // 新建/修改限时特惠
  seckillInfodetail: '/ybt-backend/org/marketinfo/seckillInfo/detail', // 限时特惠活动详情
  distBugetReportlist: '/ybt-backend/api/distBugetReport/list', // 查询积分审核导出列表
  approvalDetails: ' /ybt-backend/api/distBugetReport/approvalDetails', // 查询积分审核详情导出列表
  queryDistRuleList: '/ybt-backend/api/distBugetReport/queryDistRuleList',
  ffdistributeList: '/ybt-backend/api/distBugetReport/distributeList',
  distributeDetails: '/ybt-backend/api/distBugetReport/distributeDetails',
  querySupplyList: '/ybt-backend/product/siteproduct/querySupplyList',
  // api供应链
  queryApiInvoicesListPage: '/ybt-backend/apiInvoice/queryApiInvoicesListPage', // api商品发票列表导出（三级申请）
  invoiceConfirm: '/ybt-backend/apiInvoice/invoiceConfirm',
  queryApiInvoicesInfoById: '/ybt-backend/apiInvoice/queryApiInvoicesInfoById',
  queryInvoicesOrderDetailList: '/ybt-backend/apiInvoice/queryInvoicesOrderDetailList',
  logisticsConfirm: '/ybt-backend/apiInvoice/logisticsConfirm',
  saveOrUpdateLogistics: '/ybt-backend/apiInvoice/saveOrUpdateLogistics',
  queryComList: '/ybt-backend/order/order/queryComList',
  queryLogistics: '/ybt-backend/apiInvoice/queryLogistics'
}
export default apis
