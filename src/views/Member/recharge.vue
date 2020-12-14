<template>
  <div class="recharge">
    <div class="recharge-info">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(item,index) in rechargeitem" :key="index">
          <div class="grid-content">
             <div class="info-item">
                <div class="info-item-title" :class="index==0 ?'vip1':index==1 ?'vip2':'vip3'">
                  <h3>{{item.title}}</h3>
                  <p>
                    {{item.summary}}
                  </p>
                </div>
                <div class="info-item-list">
                  <ul>
                    <li v-for="(itemA,indexA) in item.list" :key="indexA" :class="{'nobuy':itemA.ishave==false}">
                      <i class="have" :class="{'nohave':itemA.ishave==false}"></i>{{itemA.text}}
                    </li>
                  </ul>
                    <div class="item-btn"  @click="handleClick(index)">
                      <el-button type="primary"  class="item-btn-1">立即{{rechargeBtnText(index)}}</el-button>
                      <p>{{item.price}}<span>{{item.mprice}}</span>
                      </p>
                  </div>
                </div>
              </div>
          </div>
          </el-col>
      </el-row>

      <!-- <div class="info-item" v-for="item in 3"
        :key="item"
      >
      <img src="./../img/vip1.png" v-if="item === 1"/>
      <img src="./../img/vip2.png" v-if="item === 2"/>
      <img src="./../img/vip3.png" v-if="item === 3"/>
      <div class="item-btn">
        <el-button type="primary" @click="handleClick(item)" style="width:100px;display:inline-block;height:40px;">立即{{rechargeBtnText(item)}}</el-button>
        <p>优惠价 {{rechargeBtnText1(item)}}<span>原价 ¥{{item==1?'6800':item==2?'15800 ':'68000'}}/年</span>
        </p>
      </div>
      </div> -->
    </div>
    <img v-show="isInfo" style="width: 100%; height: 100%;" src="./../img/vipInfo.png" alt />
    <p class="look-info" @click="isInfo = !isInfo">
      {{isInfo ? '收起详情' : '查看详细权益及对比'}}
      <img v-show="!isInfo" src="./../img/up.png" alt />
      <img v-show="isInfo" src="./../img/down.png" alt />
    </p>
    <div class="footer">
      <h3>如有疑问, 专业的项目经理为您解答</h3>
      <p>咨询电话: {{managerTell}}</p>
      <p class="footer-tip">大客户定制 / 购买咨询 / 优惠促销 / 产品咨询</p>
    </div>

    <el-dialog title="购买提示" :visible.sync="rechargeShow" width="548px" class="rechargeDialog" :before-close="handleClose">
      <!-- 已过期(平级升级降级) || 未过期(平级和升级) -->
      <div
        class="recharge-row"
        v-if="orgVip.overdueFlag === '0' || (orgVip.overdueFlag === '1' && activeType >= orgVip.vipType)"
      >
        您的{{getVipType(this.orgVip.vipType)}}有效期截止至
        <span class="mark">{{orgVip.validEndDate.split(' ')[0]}}</span>，{{getVipType(this.activeType)}}权益将在付费后立即生效，有效期为
        <span class="mark">{{getExpirationDate()}}</span>
      </div>
      <!-- 未过期(降级) -->
      <div class="recharge-row" v-if="orgVip.overdueFlag === '1' && activeType < orgVip.vipType">
        您的{{getVipType(this.orgVip.vipType)}}有效期截止至
        <span class="mark">{{orgVip.validEndDate.split(' ')[0]}}</span>
        ，{{getVipType(this.activeType)}}权益将在
        <span class="mark">{{getNewDate({date: this.orgVip.validEndDate})}}</span>日开始生效，有效期为
        <span class="mark">{{getExpirationDate()}}</span>
      </div>
      <div class="recharge-account">
        <div class="dd1">金额: {{rechargeAmount}}元/年</div>
        <div class="dd2">账户余额: {{balanceYuan}}元</div>
        <div v-show="isLack">
          <span class="mark" style="font-size: 12px;">余额不足,无法续费！</span>
          <span @click="$router.push({name: 'financeIndex', params: {flag: true}})" style="color:#1985FF; font-size: 12px; cursor: pointer;text-decoration: underline;">去充值</span>
        </div>
      </div>
      <div class="recharge-upload">
        添加附件
        <el-upload
          class="recharge-uploader"
          ref="upload"
          action="/ybt-backend/sys/oss/upload"
          :show-file-list="false"
          :headers="myHeaders"
          :on-change="handleChange"
          :on-success="handleUploadSuccess"
          :auto-upload="false"
        >
          <img v-if="fileUrl" :src="fileUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <p class="recharge-tip">在余额充足的情况下确认后，将从您的预存款账户内扣除<span class="mark">{{rechargeAmount}}</span>元，{{rechargeBtn[activeType]}}成功。</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleRecharge">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rechargeitem: [
        {
          title: '基础会员（2020）',
          summary: ' 适合个人或5个人以下的团队，可创建5个商城/年，满足销售，推广营销等基础经营需求',
          list: [
            {
              ishave: true,
              text: '可创建5个积分商城'
            },
            {
              ishave: true,
              text: '可建无限个礼包或积分卡'
            },
            {
              ishave: true,
              text: '可添加1个机构管理员账号'
            },
            {
              ishave: false,
              text: '不可创建自有供应商账号'
            },
            {
              ishave: false,
              text: '分期商城'
            },
            {
              ishave: false,
              text: '秒杀抽奖等营销推广工具'
            },
            {
              ishave: false,
              text: '拼团砍价等营销推广工具（可购买，8800/年）'
            },
            {
              ishave: false,
              text: '线下商户扫码收款应用'
            },
            {
              ishave: false,
              text: '移动端审批/分发积分'
            },
            {
              ishave: false,
              text: '运营特训班（银行客户解决方案）'
            },
            {
              ishave: false,
              text: '数字化核销系统（独立版）(可购买,39800/年)'
            }
          ],
          price: '优惠价 ¥3980/年',
          mprice: '原价 ¥6800/年'
        },
        {
          title: 'VIP会员（2020）',
          summary: ' 适合5人以上，成长型的商家，更多适合银行客户的应用，满足推广获客，营销等核心经营需求',
          list: [
            {
              ishave: true,
              text: '可创建无限个积分商城'
            },
            {
              ishave: true,
              text: '可建无限个礼包或积分卡'
            },
            {
              ishave: true,
              text: '可添加5名机构管理员账号'
            },
            {
              ishave: true,
              text: '可建无限个自有供应商账号'
            },
            {
              ishave: false,
              text: '分期商城'
            },
            {
              ishave: true,
              text: '秒杀抽奖等营销推广工具'
            },
            {
              ishave: true,
              text: '拼团等更多营销推广工具'
            },
            {
              ishave: true,
              text: '线下商户扫码收款应用'
            },
            {
              ishave: true,
              text: '移动端审批/分发积分'
            },
            {
              ishave: false,
              text: '运营特训班（银行客户解决方案）'
            },
            {
              ishave: false,
              text: '数字化核销系统（独立版）(可购买,39800/年)'
            }
          ],
          price: '优惠价 ¥8800/年',
          mprice: '原价 ¥15800/年'
        },
        {
          title: 'PLUS会员（2020）',
          summary: '适合5人以上，规模化扩张的商家，全部的适合银行客户的应用及在线培训课程，满足创新营销玩法等深度经营需求',
          list: [
            {
              ishave: true,
              text: '可创建无限个积分商城'
            },
            {
              ishave: true,
              text: '可建无限个礼包或积分卡'
            },
            {
              ishave: true,
              text: '可添加20名机构管理员账号'
            },
            {
              ishave: true,
              text: '可建无限个自有供应商账号'
            },
            {
              ishave: true,
              text: '可建10个分期商城'
            },
            {
              ishave: true,
              text: '秒杀抽奖等营销推广工具'
            },
            {
              ishave: true,
              text: '拼团等更多营销推广工具'
            },
            {
              ishave: true,
              text: '线下商户扫码收款应用'
            },
            {
              ishave: true,
              text: '移动端审批/分发积分'
            },
            {
              ishave: true,
              text: '运营特训班（银行客户解决方案）'
            },
            {
              ishave: true,
              text: '数字化核销系统（独立版）'
            }
          ],
          price: '优惠价 ¥39800/年',
          mprice: '原价 ¥68000/年'
        }],
      myHeaders: {
        token:
          localStorage.getItem('token') +
          '.' +
          localStorage.getItem('orgId') +
          '.' +
          localStorage.getItem('pageSiteId')
      },
      isInfo: false,
      rechargeShow: false,
      balanceYuan: '',
      orgVip: JSON.parse(localStorage.getItem('orgVip')),
      rechargeList: {
        0: '3980',
        1: '8800',
        2: '39800'
      },
      rechargeBtn: {
        0: '购买',
        1: '购买',
        2: '购买'
      },
      activeType: '', // 会员类型
      rechargeAmount: '', // 支付金额
      fileUrl: '',
      managerTell: ''
    }
  },
  created () {
    this.getAccount()
    this.managerTell = JSON.parse(localStorage.getItem('orgVipDetail')).accountManager || '--'
  },
  methods: {
    getAccount () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/finance/orgaccount/myAccount'),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: localStorage.getItem('orgId')
          },
          true
        )
      }).then(res => {
        if (res && res.data.code === 0) {
          this.balanceYuan = res.data.account.balanceYuan
        }
      })
    },
    handleChange (file, fileList) {
      this.submitUpload()
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleUploadSuccess (response, file, fileList) {
      console.log(response)
      if (response.code == 500) {
        this.$message.error('请按照正确的格式上传')
      }
      this.fileUrl = response.url
    },
    handleClick (item) {
      this.activeType = item
      this.rechargeAmount = this.rechargeList[item]
      this.rechargeShow = true
    },
    handleRecharge () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/buyOrgVip'),
        method: 'post',
        data: this.$http.adornData({
          vipType: this.activeType,
          orgId: localStorage.getItem('orgId'),
          payAmount: this.rechargeAmount,
          buyYearNum: 1,
          fileUrl: this.fileUrl
        })
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success('支付成功')
          this.handleClose()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 按钮文案
    rechargeBtnText (type) {
      if (this.orgVip.vipType === 1 && this.orgVip.overdueFlag == 1) {
        this.rechargeBtn[0] = '续费'
        this.rechargeBtn[1] = '升级'
        this.rechargeBtn[2] = '升级'
      } else if (this.orgVip.vipType === 2) {
        this.rechargeBtn[1] = '续费'
        this.rechargeBtn[2] = '升级'
      } else if (this.orgVip.vipType === 3) {
        this.rechargeBtn[2] = '续费'
      }
      return this.rechargeBtn[type]
    },

    getExpirationDate () {
      let start = ''
      let end = ''
      // 已过期(平级升级降级)或未过期升级
      if (
        this.orgVip.overdueFlag === '0' ||
        (this.activeType > this.orgVip.vipType &&
          this.orgVip.overdueFlag === '1')
      ) {
        // 当前日期
        start = this.getNewDate()
        end = this.getNewDate({ year: 1})
        //  当前时间至往后一年
        return start + '至' + end
      } else if (
        (this.orgVip.overdueFlag === '1' &&
          this.activeType === this.orgVip.vipType) ||
        (this.orgVip.overdueFlag === '1' &&
          this.activeType < this.orgVip.vipType)
      ) {
        // 未过期, 平级降级
        start = this.getNewDate({ date: this.orgVip.validEndDate})
        end = this.getNewDate({
          date: this.orgVip.validEndDate,
          year: 1,
          day: 1
        })
        // 有效日期后一天至往后一年
        return start + '至' + end
      }
    },
    // 获取日期
    getNewDate (obj = {}) {
      let newDate = obj.date ? new Date(obj.date) : new Date()
      let year = obj.year || 0
      let day = obj.day || 0
      let newY = newDate.getFullYear() + year
      let newM = newDate.getMonth() + 1
      let newD = newDate.getDate() + day
      if (newM < 10) {
        newM = '0' + newM
      }
      if (newD < 10) {
        newD = '0' + newD
      }
      return newY + '-' + newM + '-' + newD
    },
    handleClose () {
      this.fileUrl = ''
      this.rechargeShow = false
    },
    // 会员类型
    getVipType (val) {
      let text = ''
      switch (val) {
        case 1:
          text = '基础会员'
          break
        case 2:
          text = 'VIP会员'
          break
        case 3:
          text = 'PLUS会员'
          break
      }
      return text
    }
  },
  computed: {
    isLack () {
      if (Number(this.rechargeAmount) - Number(this.balanceYuan) > 0) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.recharge {
  padding: 0 60px;
  background-color: #fff;
  padding-top:20px;
  .recharge-info {
    display: flex;
    justify-content: space-between;
    margin-bottom:50px;
    .info-item {
      position: relative;
      background:rgba(255,255,255,1);
      box-shadow:2px 3px 14px rgba(25,133,255,0.15);
      // padding:0 60px;
      margin:0 2%;
      // flex: 0 0 33.33%;
      .info-item-title{
        height:220px;
        h3{
          font-size: 18px;
          line-height: 25px;
          text-align: center;
          padding-top:50px;
          padding-bottom:16px;
        }
        p{
          font-size: 14px;
          line-height: 20px;
          padding: 0 50px;
          padding-bottom:50px;
        }
        &.vip1{
            background: url(./img/vip1.png) no-repeat center top;
            background-size: 100% 100%;
            h3{
              color:#333333
            }
            p{
              color:#666666
            }
        }
         &.vip2{
            background: url(./img/vip2.png) no-repeat center top;
            background-size: 100% 100%;
            h3{
              color:#805933
            }
            p{
              color:#99734D
            }
        }
         &.vip3{
            background: url(./img/vip3.png) no-repeat center top;
            background-size: 100% 100%;
              h3{
              color:#FAD8BE
            }
            p{
              color:#F0D5C0
            }
        }
      }
      .info-item-list{
         padding:30px 0;
        ul{
           padding:0 50px;
          li{
            font-size: 14px;
            color:#333333;
            margin-bottom: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            i{
              width:16px;
              height: 16px;
              background: url(./img/icon1.png) no-repeat center top;
              background-size: 100% 100%;
              display: inline-block;
              vertical-align: bottom;
              margin-right:8px;
              &.nohave{
                background: url(./img/icon2.png) no-repeat center top;
                background-size: 100% 100%;
              }
            }
            &.nobuy{
               color:#999999;
            }
          }
        }
      }
      .item-btn {
        font-weight: 600;
        cursor: pointer;
        padding-top:9px;
        p{
          display: inline-block;
          color:#1985FF;
          font-size: 16px;
          font-weight: 400;
          line-height: 20px;
          text-align: left;
          padding-left: 8px;
          vertical-align: top;
          span{
            display: block;
            font-size: 14px;
            color:#666666;
            text-decoration: line-through;

          }
        }
        .item-btn-1{
         margin-left: 50px;
        }
      }
    }
    .info-item1 {
      background: url("./../img/vip1.png") no-repeat;
      background-size: 100% 100%;
    }
    .info-item2 {
      background: url("./../img/vip2.png") no-repeat;
      background-size: 100% 100%;
    }
    .info-item3 {
      background: url("./../img/vip3.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .look-info {
    line-height: 30px;
    font-size: 14px;
    color: #1985ff;
    text-align: center;
    cursor: pointer;
    img {
      width: 12px;
      height: 12px;
      margin-left: 5px;
    }
  }
  .footer {
    padding: 10px 0;
    text-align: center;
    line-height: 24px;
    h3 {
      font-size: 14px;
      color: #333333;
      font-weight: 600;
    }
    p {
      font-size: 12px;
      color: #1985ff;
    }
    .footer-tip {
      color: #666;
    }
  }
  .rechargeDialog {
    .recharge-row {
      padding: 6px 15px;
      background-color: #fff2d9;
      border: 1px solid #ffa703;
    }
    .mark {
      color: #ff625e;
    }
    .recharge-account {
      display: flex;
      justify-content:flex-start;
      line-height: 50px;
      margin-bottom: 0;
      .dd1,.dd2{
        margin-right:50px;
      }
    }
    .recharge-tip {
      color: #333;
      font-size: 12px;
      line-height: 30px;
    }
    .recharge-upload {
      display: flex;

    }
    /deep/.recharge-uploader{
      margin-left: 10px;
    }
    /deep/.recharge-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .recharge-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 64px;
      height: 64px;
      text-align: center;
      line-height: 64px !important;
    }
    .avatar {
      width: 64px;
      height: 64px;
      display: block;
    }
  }
  /deep/ .el-dialog__body{
    padding-top: 0 !important;
  }
}
</style>
