<template>
  <div class="mod-sysor">
    <div class="mod-user-left">
      <div class="left-head">组织机构</div>
      <div class="sid-menu">
        <sub-menu
          :sub="item"
          :openKeys="openKeys"
          @getData="getData"
          v-for="item in menuList"
          :key="item.id"
        />
      </div>
    </div>
    <div class="mod-user-right">
      <div class="right-head">{{framework || '组织机构列表'}}</div>
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList()"
        v-show="orgType!=4"
      >
        <el-form-item>
          <el-button
            v-if="isAuth('sys:user:save')"
            type="primary"
            @click="centerDialogVisible=true"
          >新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;"
        v-show="orgType!=4"
        :header-cell-style="{color:'#333',background:'#F5F7FA'}"
      >
        <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
        <el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          width="200"
          label="名称"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="status" header-align="center" align="center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.locked === 0" size="small">正常</el-tag>
            <el-tag v-else size="small" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="有效期"
          v-if="orgType==3"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.validStartDate"></span>
            <span v-show="scope.row.validStartDate!=null">至</span>
            <span v-html="scope.row.validEndDate"></span>
          </template>
        </el-table-column>-->
        <el-table-column header-align="center" align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="isAuth('sys:user:update')"
              type="text"
              size="small"
              @click="addOrUpdateHandle(scope.row)"
            >修改</el-button>
            <!-- <el-button
              v-if="isAuth('sys:user:delete')"
              type="text"
              size="small"
              @click="deleteHandle(scope.row.userId)"
            >删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="isSiteList"
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;"
        v-show="orgType==4"
        :header-cell-style="{color:'#333',background:'#F5F7FA'}"
      >
        <el-table-column prop="id" header-align="center" align="center" width="80" label="商城ID"></el-table-column>
        <el-table-column
          prop="siteName"
          header-align="center"
          align="center"
          width="200"
          label="商城名称"
        ></el-table-column>
        <el-table-column prop="accountBlance" header-align="center" align="center" label="账户额度"></el-table-column>
        <el-table-column prop="productCount" align="center" label="上架商品"></el-table-column>
        <el-table-column prop="packsCount" align="center" label="已分发礼包"></el-table-column>
        <el-table-column prop="voucherSum" align="center" label="已分发积分"></el-table-column>
        <el-table-column prop="merberCount" align="center" label="会员数量"></el-table-column>
        <el-table-column prop="createDate" header-align="center" align="center" label="创建时间"></el-table-column>
        <el-table-column header-align="center" align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="delSite(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <el-dialog
      :title="!idr ? '新增' : '修改'"
      :visible.sync="centerDialogVisible"
      width="750px"
      :closeOnClickModal="false"
    >
      <el-form v-model="dux" label-width="120px" :disabled="isDisable==true">
        <el-form-item
          label="机构名称："
          :rules="[{ required: true, message: '机构名称不能为空'}]"
          class="formItem"
        >
          <el-input :style="{'width':'290px'}" v-model="ordername"></el-input>
        </el-form-item>
        <el-form-item label="项目经理电话：" class="formItem">
          <el-input :style="{'width':'150px'}" v-model="accountManager"></el-input>
        </el-form-item>
        <el-form-item label="会员级别：" required >
          <el-radio v-model="vipType" label="1" :disabled="idr!='' && orgType != '2'">基础会员</el-radio>
          <el-radio v-model="vipType" label="2" :disabled="idr!='' && orgType != '2'">VIP会员</el-radio>
          <el-radio v-model="vipType" label="3" :disabled="idr!='' && orgType != '2'">PLUS会员</el-radio>
        </el-form-item>
        <el-form-item label="有效起始日期：" required class="formItem">
          <el-date-picker
            :style="{'width':'290px'}"
            v-model="orgTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :isShowTime="false"
            :disabled="idr!='' && orgType != '2'"
          ></el-date-picker>
        </el-form-item><br>
        <el-form-item label="机构状态：" class="formItem">
          <el-radio v-model="locked" label="1" >禁用</el-radio>
          <el-radio v-model="locked" label="0">正常</el-radio>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="联系方式" name="first">
          <el-form v-model="contactInfo" label-width="80px" :disabled="isDisable==true">
            <el-form-item label="联系人" class="formItem" required>
              <el-input :style="{'width':'120px'}" v-model="contactInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="手机" class="formItem" required>
              <el-input
                :style="{'width':'120px'}"
                v-model="contactInfo.phone"
                maxlength="11"

              ></el-input>
            </el-form-item>
            <el-form-item label="座机电话" class="formItem">
              <el-input :style="{'width':'120px'}" v-model="contactInfo.tel" ></el-input>
            </el-form-item>
            <el-form-item label="QQ" class="formItem">
              <el-input :style="{'width':'120px'}" v-model="contactInfo.qq" ></el-input>
            </el-form-item>
            <el-form-item label="传真号" class="formItem">
              <el-input
                :style="{'width':'120px'}"
                v-model="contactInfo.faxNumber"

              ></el-input>
            </el-form-item>
            <el-form-item label="省市区" v-show="idr == ''">
              <AddressList ref="addressList" @mallSiteDistrict="mallSiteListDistrict"></AddressList>
            </el-form-item>
            <el-form-item label="省市区" v-show="idr != ''">{{shengshiqu}}</el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="contactInfo.address" type="textarea" ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- <el-tab-pane label="开票及账户信息" name="second">
          <el-form v-model="accountInfo" label-width="100px">
            <el-form-item label="开户银行" class="formItem">
              <el-input :style="{'width':'300px'}" v-model="accountInfo.bank" ></el-input>
            </el-form-item>
            <el-form-item label="账号" class="formItem">
              <el-input
                :style="{'width':'300px'}"
                v-model="accountInfo.accounts"

              ></el-input>
            </el-form-item>
            <el-form-item label="发票类型" class="formItem">
              <el-select
                v-model="accountInfo.Invoice"
                placeholder="全部"
                @change="getInvoice"

                :style="{'width':'150px'}"
              >
                <el-option label="增值税专用发票" value="1"></el-option>
                <el-option label="增值税普通发票" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="税务登记证号">
              <el-input v-model="accountInfo.number" ></el-input>
            </el-form-item>
            <el-form-item label="注册场所地址">
              <el-input v-model="accountInfo.addressReg" ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>-->
        <el-tab-pane label="资质附件" name="third">
          <el-form v-model="qualificationAnnex" label-width="100px" :disabled="isDisable==true">
            <el-form-item label="营业执照号" class="formItem" required>
              <el-input
                :style="{'width':'180px'}"
                v-model="qualificationAnnex.certificateNum"

              ></el-input>
            </el-form-item>
            <el-form-item label="公司法人" class="formItem" required>
              <el-input
                :style="{'width':'120px'}"
                v-model="qualificationAnnex.legalPerson"

              ></el-input>
            </el-form-item>
            <el-form-item label="资质附件">
              <el-upload
                class="avatar-uploader"
                :action="url"
                :show-file-list="false"
                :beforeUpload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :data="myHeaders"

              >
                <img
                  v-if="qualificationAnnex.fileUrl"
                  :src="qualificationAnnex.fileUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="increased()" v-if="!idr">确定</el-button>
        <el-button type="primary" @click="revise()" v-if="idr">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddressList from '@/components/common/AddressList'
const SubMenu = {
  name: 'SubMenu',
  props: ['sub', 'openKeys'],
  data () {
    return {
      activeOpen: []
    }
  },
  template: `
      <div class="item-menu sub2" :ref="'item_menu'+sub.id">
        <div :class="'sid-title ' + (openKeys == sub.id && 'sid-active')" >
            <i class="icon" v-if="sub.childList.length>0" type="cluster" @click.stop="onChange(sub)"></i> 
            <i class="iconsr" v-if="sub.childList" type="cluster"></i>
            <span @click.stop="getData(sub)" class="sidconter">{{sub.name}}</span>
          </div>
          <ul class="sid-list" v-if="sub.childList" >
            <li class="" @click.stop="getData(item)" v-for="item in sub.childList" :key="item.id">
              <SubMenu  :sub="item" :openKeys="openKeys" @onChange="onChange" @getData="getData" />
          </li>
        </ul>
      </div>
    
    `,
  watch: {
    openKeys (newV) {
      this.$nextTick(() => {
        this.onChange({
          id: this.openKeys
        })
      })
    }
  },

  methods: {
    onChange (sub) {
      var divP = this.$refs['item_menu' + sub.id]
      if (divP) {
        if (!this.activeOpen.some(item => item === sub.id)) {
          this.activeOpen.push(sub.id)
          divP.style.height = 'auto'
          divP.style.overflow = 'initial'
        } else {
          this.activeOpen = this.activeOpen.filter(item => item !== sub.id)
          divP.style.height = '32px'
          divP.style.overflow = 'hidden'
        }
      }
    },
    getData (item) {
      this.$emit('getData', item)
    }
  }
}

export default {
  data () {
    return {
      isValida: false,
      url: this.$http.adornUrl(`/ybt-backend/sys/oss/upload`),
      myHeaders: {
        token:
          localStorage.getItem('token') +
          '.' +
          localStorage.getItem('orgId') +
          '.' +
          localStorage.getItem('pageSiteId')
      },

      // myHeaders: {
      //   token: sessionStorage.getItem('token')
      // },
      activeName: 'first',
      orgTime: '',
      contactInfo: {
        name: '',
        phone: '',
        tel: '',
        qq: '',
        faxNumber: '',
        valueProCityArea: [],
        valuePro: '',
        valuecity: '',
        valuearea: '',
        firstDistrictName: '',
        secondDistrictName: '',
        thirdDistrictName: '',
        address: '',
        Invoice: 1
      },
      accountInfo: {
        bank: '',
        accounts: '',
        number: '',
        addressReg: ''
      },
      qualificationAnnex: {
        certificateNum: '',
        legalPerson: '',
        fileUrl: ''
      },
      orgType: '',
      framework: '',
      locked: '0',
      centerDialogVisible: false,
      rootSubmenuKeys: [],
      openKeys: '1',
      treeList: [],
      collapsed: false,
      option: [
        {
          siteName: '公司员工',
          id: 1
        },
        {
          siteName: '线上供应商',
          id: 2
        },
        {
          siteName: '线下商户',
          id: 3
        }
      ],
      coluse: false,
      style: '',
      userId: '',
      options: [
        {
          statusName: '禁用',
          status: 0
        },
        {
          statusName: '正常',
          status: 1
        }
      ],
      dux: {},
      status: '',
      idr: '',
      menuListTreeProps: {
        label: 'name',
        children: 'childList'
      },
      dataForm: {
        userName: ''
      },
      ordername: '',
      accountManager: '',
      menuList: [],
      dataList: [],
      isSiteList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      ids: '',
      flag: false,
      isDisable: false,
      roleList: [],
      ishowSiteInfo: false,
      shengshiqu: '',
      vipType: ''
    }
  },
  components: {
    AddressList,
    'sub-menu': SubMenu
  },
  created () {
    this.getTreelist()
  },
  watch: {
    centerDialogVisible () {
      console.log(this.ids)
      if (this.centerDialogVisible === false) {
        this.locked = '0'
        this.idr = ''
        this.ordername = '' // 机构名称
        this.accountManager = '' // 客户经理
        this.contactInfo.name = ''
        this.contactInfo.phone = ''
        this.contactInfo.tel = ''
        this.contactInfo.qq = ''
        this.contactInfo.faxNumber = ''
        this.contactInfo.valuePro = ''
        this.contactInfo.firstDistrictName = ''
        this.contactInfo.valuecity = ''
        this.contactInfo.secondDistrictName = ''
        this.contactInfo.valuearea = ''
        this.contactInfo.thirdDistrictName = ''
        this.contactInfo.valueProCityArea = []
        this.contactInfo.address = '' // 详细地址
        this.accountInfo.accounts = '' // 账号
        this.accountInfo.bank = ''
        this.contactInfo.Invoice = 1
        this.accountInfo.number = ''
        this.accountInfo.addressReg = ''
        this.qualificationAnnex.certificateNum = '' // 营业执照
        this.qualificationAnnex.legalPerson = '' // 法人
        this.qualificationAnnex.fileUrl = '' // 附件
        this.orgTime = ''
        this.activeName = 'first'
        this.$refs.addressList.type = 1
        this.$refs.addressList.channelId = ''
        this.$refs.addressList.getaddress(1, 1, '')
        this.shengshiqu = ''
        this.vipType = ''
      }
      this.isDisable = false
      // if (this.idr === '') {
      //   this.isDisable = false
      // } else {
      //   if (this.orgType != 2) {
      //     this.isDisable = true
      //   } else {
      //     this.isDisable = false
      //   }
      // }
    }
  },
  mounted () {
    this.typeEdit = ''
  },
  methods: {
    getInvoice (item) {
      console.log(item)
      this.contactInfo.Invoice = item
    },
    // 地址
    mallSiteListDistrict (item) {
      this.contactInfo.valuePro = item.firstDistrictId
      this.contactInfo.firstDistrictName = item.firstDistrictName
      this.contactInfo.valuecity = item.secondDistrictId
      this.contactInfo.secondDistrictName = item.secondDistrictName
      this.contactInfo.valuearea = item.thirdDistrictId
      this.contactInfo.thirdDistrictName = item.thirdDistrictName
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 删除网站
    delSite (item) {
      this.$confirm('删除后不可恢复，是否确认删除此商城？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/mall/mallsite/deleteSite'),
          method: 'post',
          data: this.$http.adornData(
            {
              siteId: item.id
            },
            true
          )
        }).then(data => {
          if (data && data.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.pageIndex = 1
            this.mallsitelist()
          } else {
            this.$message({
              type: 'fail',
              message: '删除失败!'
            })
          }
        })
      })
    },
    // 验证表单
    validForm () {
      this.isValida = false
      if (this.ordername == '') {
        return this.$message.error('机构名称不能为空')
      }
      if (this.vipType == '') {
        return this.$message.error('会员级别不能为空')
      }

      if (this.orgTime === null || this.orgTime === '') {
        return this.$message.error('请填写有效起始日期')
      }
      if (this.contactInfo.name == '') {
        this.activeName = 'first'
        return this.$message.error('联系人不能为空')
      }
      if (this.contactInfo.phone == '') {
        this.activeName = 'first'
        return this.$message.error('手机不能为空')
      }
      if (this.qualificationAnnex.certificateNum === '') {
        this.activeName = 'third'
        return this.$message.error('请填写营业执照号')
      }
      if (this.qualificationAnnex.legalPerson === '') {
        this.activeName = 'third'
        return this.$message.error('请填写公司法人')
      }
      this.contactInfo.valueProCityArea = []
      this.contactInfo.valueProCityArea.push(
        {
          id: this.contactInfo.valuePro,
          name: this.contactInfo.firstDistrictName
        },
        {
          id: this.contactInfo.valuecity,
          name: this.contactInfo.secondDistrictName
        },
        {
          id: this.contactInfo.valuearea,
          name: this.contactInfo.thirdDistrictName
        }
      )
      this.isValida = true
    },
    // 修改
    revise () {
      this.validForm()
      if (this.isValida === false) return
      this.isDisable = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/save'),
        method: 'post',
        data: this.$http.adornData({
          name: this.ordername, // 机构名称
          accountManager: this.accountManager === null ? '' : this.accountManager, // 客户经理
          locked: this.locked,
          contactor: this.contactInfo.name,
          phone: this.contactInfo.phone,
          telephone: this.contactInfo.tel,
          qqNum: this.contactInfo.qq,
          faxNum: this.contactInfo.faxNumber,
          address: JSON.stringify(this.contactInfo.valueProCityArea), // this.contactInfo.AddressList
          addressDetail: this.contactInfo.address, // 详细地址
          // accountInfo: this.accountInfo.accounts, // 账号
          // depositBank: this.accountInfo.bank,
          // invoiceType: this.contactInfo.Invoice,
          // taxNo: this.accountInfo.number,
          // registerAddress: this.accountInfo.addressReg,
          certificateNum: this.qualificationAnnex.certificateNum, // 营业执照
          legalPerson: this.qualificationAnnex.legalPerson, // 法人
          fileUrl: this.qualificationAnnex.fileUrl, // 附件
          validStartDate: this.orgTime[0],
          validEndDate: this.orgTime[1],
          parentId: this.ids || '',
          id: this.idr,
          type: this.typeEdit,
          vipType: this.vipType
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.centerDialogVisible = false
          this.$message.success('操作成功')
          this.idr = ''
          this.getDataList()
          this.getTreelist()
        } else {
          this.$message.error(data.msg)
        }
        this.isDisable = false
      })
    },
    // 新增
    increased () {
      this.validForm()
      if (this.isValida === false) return
      this.isDisable = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/save'),
        method: 'post',
        data: this.$http.adornData({
          name: this.ordername, // 机构名称
          accountManager: this.accountManager, // 客户经理
          locked: this.locked,
          contactor: this.contactInfo.name,
          phone: this.contactInfo.phone,
          telephone: this.contactInfo.tel,
          qqNum: this.contactInfo.qq,
          faxNum: this.contactInfo.faxNumber,
          address: JSON.stringify(this.contactInfo.valueProCityArea), // this.contactInfo.AddressList
          addressDetail: this.contactInfo.address, // 详细地址
          // accountInfo: this.accountInfo.accounts, // 账号
          // depositBank: this.accountInfo.bank,
          // invoiceType: this.contactInfo.Invoice,
          // taxNo: this.accountInfo.number,
          // registerAddress: this.accountInfo.addressReg,
          certificateNum: this.qualificationAnnex.certificateNum, // 营业执照
          legalPerson: this.qualificationAnnex.legalPerson, // 法人
          fileUrl: this.qualificationAnnex.fileUrl, // 附件
          validStartDate: this.orgTime[0] + ' 00:00:00',
          validEndDate: this.orgTime[1] + ' 23:59:59',
          parentId: this.ids || '',
          type: this.orgType,
          vipType: this.vipType
        })
      }).then(({ data }) => {
        this.isDisable = false
        if (data && data.code === 0) {
          this.centerDialogVisible = false
          this.$message.success('操作成功')
          this.getDataList()
          this.getTreelist()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 点击左侧事件
    getData (item) {
      this.orgType = item.type
      this.openKeys = item.id
      this.ids = item.id
      this.framework = item.name
      this.pageIndex = 1
      // if (item.ishowSite === true) {
      //   this.ishowSiteInfo = true
      //   this.mallsitelist()
      // } else {
      //   this.ishowSiteInfo = false
      //   this.getDataList()
      // }
      if (this.orgType === 4) {
        this.ishowSiteInfo = true
        this.mallsitelist()
      } else {
        this.ishowSiteInfo = false
        this.getDataList()
      }
      console.log(item)
    },

    stateFormat (row, column) {
      if (row.type == 1) {
        return '公司员工'
      } else if (row.type == 2) {
        return '线上供应商'
      } else if (row.type == 3) {
        return '线下商户'
      }
    },

    getTreelist () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/treelist'),
        method: 'post',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.menuList = [data.orgTree]
          this.ids = this.menuList[0].id
          for (let i = 0; i < this.menuList[0].childList.length; i++) {
            const element = this.menuList[0].childList[i]
            for (let j = 0; j < element.childList.length; j++) {
              const jj = element.childList[j]
              jj.ishowSite = true
            }
          }
          this.orgType = this.menuList.type
          if (this.menuList[0].childList.length > 0) {
            this.$nextTick(() => {
              this.getData(this.menuList[0])
            })
          } else {
            this.menuList[0].ishowSite = true
            this.$nextTick(() => {
              this.getData(this.menuList[0])
            })
          }
          // if (this.orgType === 4) {
          //   this.mallsitelist()
          // } else {
          //   this.getDataList()
          // }
        } else {
        }
      })
    },

    mallsitelist () {
      this.isSiteList = []
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/listByOrg'),
        method: 'get',
        params: this.$http.adornParams({
          orgId: this.ids,
          page: this.pageIndex,
          limit: this.pageSize
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.isSiteList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.isSiteList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },

    // 获取数据列表
    getDataList () {
      this.dataList = []
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/list'),
        method: 'post',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          username: this.dataForm.userName,
          orgId: this.ids,
          type: this.orgType
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
        }
        this.dataListLoading = false
      })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      if (this.orgType === 4) {
        this.mallsitelist()
      } else {
        this.getDataList()
      }
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      if (this.orgType === 4) {
        this.mallsitelist()
      } else {
        this.getDataList()
      }
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 修改
    addOrUpdateHandle (res) {
      this.idr = res.id
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/orgDetailById'),
        method: 'post',
        params: this.$http.adornParams({
          orgId: res.id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var item = data.detail
          console.log(item)
          this.typeEdit = item.type
          this.centerDialogVisible = true
          this.ordername = item.name
          this.locked = String(item.locked)
          this.accountManager = item.accountManager
          this.contactInfo.name = item.contactor
          this.contactInfo.phone = item.phone
          this.contactInfo.tel = item.telephone
          this.contactInfo.qq = item.qqNum
          this.contactInfo.faxNumber = item.faxNum
          this.vipType = item.vipType + ''
          this.contactInfo.valueProCityArea = JSON.parse(item.address)
          let vpca = this.contactInfo.valueProCityArea
          if (vpca != null) {
            this.contactInfo.valuePro = vpca[0] === undefined ? '' : vpca[0].id
            this.contactInfo.firstDistrictName = vpca[0] === undefined ? '' : vpca[0].name
            this.contactInfo.valuecity = vpca[1] === undefined ? '' : vpca[1].id
            this.contactInfo.secondDistrictName = vpca[1] === undefined ? '' : vpca[1].name
            this.contactInfo.valuearea = vpca[2] === undefined ? '' : vpca[2].id
            this.contactInfo.thirdDistrictName = vpca[2] === undefined ? '' : vpca[2].name
          }
          if (this.contactInfo.valueProCityArea != null) {
            for (let index = 0; index < this.contactInfo.valueProCityArea.length; index++) {
              const element = this.contactInfo.valueProCityArea[index]
              this.shengshiqu += element.name + '-'
            }
            this.shengshiqu = this.shengshiqu.substring(0, this.shengshiqu.length - 1)
            this.contactInfo.address = item.addressDetail // 详细地址
          }

      // this.accountInfo.accounts = item.accountInfo// 账号
      // this.accountInfo.bank = item.depositBank
      // this.contactInfo.Invoice = item.invoiceType
      // this.accountInfo.number = item.taxNo
      // this.accountInfo.addressReg = item.registerAddress
          this.qualificationAnnex.certificateNum = item.certificateNum// 营业执照
          this.qualificationAnnex.legalPerson = item.legalPerson // 法人
          this.qualificationAnnex.fileUrl = item.fileUrl// 附件
          this.orgTime = [item.validStartDate, item.validEndDate]
          this.isDisable = true
        } else {
        }
      })
    },
    // 删除
    deleteHandle (id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.userId
        })
      this.$confirm(
        `确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/ybt-backend/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {})
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message({
          message: '上传图片大小不能超过 2MB!',
          type: 'error'
        })
      }

      return isLt2M
    },
    // 上传图片
    handleAvatarSuccess (res, file) {
      if (res.code === 401) {
        if (localStorage.getItem('isFromYunCai') ==='true') {
          this.$router.push({ name: 'loginYc' })
        } else {
          this.$router.push({ name: 'login' })
        }
      } else {
        var img = new Image()
        img.src = res.url
        img.onload = function () {
          this.photoDetail = img.width + '*' + img.height
        }
        this.qualificationAnnex.fileUrl = res.url
        console.log(this.photoDetail)
      }
    }
  }
}
</script>

<style lang="scss">
.mod-sysor-table {
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  margin-bottom: 20px;
  .mod-sysors {
    height: 50px;
    text-align: center;
    width: 33%;
    background-color: #e8f7f6;
    line-height: 50px;
    cursor: pointer;
    color: #1985ff;
  }
  .userManagement {
    background: #1985ff;
    color: #ffffff;
  }
}
/deep/ .el-dialog {
  // height: 300px;
  width: 500px;
  border-radius: 6px;
  overflow: hidden;
}

/deep/ .el-dialog__header {
  padding: 0;
  font-size: 14px;
  height: 34px;
  line-height: 34px;
  background: #f7f7f7;

  /deep/ .el-dialog__title {
    font-size: 14px;
    line-height: 34px;
    margin-left: 15px;
  }

  /deep/ .el-dialog__headerbtn {
    top: 5px;
  }
}

/deep/ .el-dialog__body {
  padding: 0;
  font-size: 14px;
  margin: 30px 0 40px;
}

/deep/ .el-dialog__footer {
  text-align: center;

  /deep/ .el-button--default {
    background: #f1f1f1;
    width: 87px;
    height: 32px;
    padding: 0;
  }

  /deep/ .el-button--primary {
    width: 87px;
    height: 32px;
    padding: 0;
  }
}
.mod-user-left {
  float: left;
  width: 260px;
  border: 1px solid #d7d7d7;
  border-radius: 4px 4px 4px 4px;
  margin-right: 20px;
  // box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.349019607843137);
  .left-head {
    height: 50px;
    line-height: 50px;
    font-weight: 700;
    font-size: 20px;
    padding-left: 6px;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
  }
}
.mod-user-right {
  // float: right;
  width: calc(100% - 285px);
  float: left;
  .right-head {
    height: 50px;
    line-height: 50px;
    font-weight: 700;
    font-size: 20px;
    padding-left: 6px;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
    margin-bottom: 11px;
  }
}
.sid-menu {
  padding: 10px;
  line-height: 32px;
  max-height: 500px;
  overflow-y: auto;
  // width: 270px;
  font-size: 14px;
}
.sid-menu .sid-active {
  background: #e6f7ff;
  border-right: #1890ff solid 2px;
}
.sid-menu .sid-list {
  padding-left: 24px;
}
.sid-menu .sid-title,
.sid-menu .sid-sub {
  cursor: pointer;
  // overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
.sid-menu .sub2 {
  height: 32px;
  overflow: hidden;
}
.sid-menu .sid-title:hover,
.sid-menu .sid-sub:hover {
  color: #1890ff;
}
.sid-menu .icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background-position: -100px 1px;
  // background: #1890ff;
  background-image: url("../../../../static/img/icons.png");
  color: #f90;
  padding-right: 6px;
  cursor: pointer;
}
.iconsr {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background-position: -260px 1px;
  // background: #1890ff;
  background-image: url("../../../../static/img/icons.png");
  color: #f90;
  padding-right: 6px;
  cursor: pointer;
}
.sidconter {
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 73px;
}
.formItem {
  display: inline-block;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
