<template>
  <el-dialog title="机构信息" :visible.sync="infoShow" width="80%" :append-to-body="true">
    <div class="orgInfo">
      <div class="info-row">
        <div class="row-title">机构信息</div>
        <div class="row-label">
          <span>{{orgInfo.orgName}}</span>
          <span class="label-time">创建时间：{{orgInfo.createDate}}</span>
        </div>
        <div class="row-content">
          <div class="content-item">
            <p>
              <span class="item-name">会员等级：</span>
              <span class="item-text">{{getVipType(orgInfo.vipType)}}</span>
              <span class="text-color" @click="$router.push({path: 'memberRecharge'}), infoShow=false">查看权益</span>
            </p>
            <p>
              <span class="item-name">会员账号：</span>
              <span class="item-text">{{orgInfo.username}}</span>
              <span class="text-color" @click="handlePassWord">修改密码</span>
            </p>
            <p>
              <span class="item-name">会员状态：</span>
              <span class="item-text" style="color: #1AC47C;">{{orgInfo.overdueFlag === '1' ? '正常' : '禁用'}}</span>
            </p>
          </div>
          <div class="content-item">
            <p>
              <span class="item-name">联系人：</span>
              <span>{{orgInfo.contactor}}</span>
            </p>
            <p>
              <span class="item-name">联系电话：</span>
              <span>{{orgInfo.phone}}</span>
            </p>
            <p>
              <span class="item-name">联系地址：</span>
              <span>{{orgInfo.address}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="info-row" style="margin-bottom: 0">
        <div class="row-content">
          <div class="content-item">
            <div class="item-title">财务概况</div>
            <div class="item-container">
              <div class="con-item">
                <div class="con-name">预存款账户余额</div>
                <div class="con-num">{{orgInfo.preBalance || 0}}</div>
                <div class="con-text text-color" @click="handleJump('financeIndex')">查看明细</div>
              </div>
              <div class="con-item">
                <div class="con-name">可提现金额</div>
                <div class="con-num">{{orgInfo.cashBalance || 0}}</div>
                <div class="con-text text-color" @click="handleJump('financeIndex', true)">去提现</div>
              </div>
              <div class="con-item">
                <div class="con-name">短信剩余条数</div>
                <div class="con-num">{{orgInfo.smsNum || 0}}</div>
                <div class="con-text text-color" @click="handleJump('smsManagementList')">查看明细</div>
              </div>
            </div>
          </div>
          <div class="content-item">
            <div class="item-title">员工管理</div>
            <div class="item-container">
              <div class="con-item">
                <div class="con-name">已有员工数</div>
                <div class="con-num">{{orgInfo.existManagerCount || 0}}</div>
                <div class="con-text text-color" @click="handleJump('sys-user')">去添加</div>
              </div>
              <div class="con-item">
                <div class="con-name">剩余可用名额</div>
                <div class="con-num">{{orgInfo.moreManagerCount || 0}}</div>
                <div class="con-text text-color" @click="handleJump('memberRecharge')">获取更多</div>
              </div>
              <div class="con-item">
                <div class="con-name">停用员工数</div>
                <div class="con-num">{{orgInfo.forbidManagerCount || 0}}</div>
                <div class="con-text text-color" @click="handleJump('sys-user')">去开启</div>
              </div>
              <div class="con-item">
                <div class="con-name">已有供应商数</div>
                <div class="con-num">{{orgInfo.supplyCount || 0}}</div>
                <div class="con-text text-color" @click="handleJump('sys-user')">去添加</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    orgInfo: {
      type: Object
    }
  },
  data () {
    return {
      infoShow: false
    }
  },
  created () {
  },
  methods: {
    handlePassWord () {
      this.$emit('handlePassword')
    },
    handleJump (val, flag) {
      this.infoShow = false
      if(flag) {
        return this.$router.push({path: val, query: {manage: true}})
      }
      this.$router.push({path: val})
    },
    getVipType (val) {
      let text = ''
      switch (val) {
        case 1 :
          text = '基础会员'
          break;
        case 2 :
          text = 'VIP会员'
          break;
        case 3 :
          text = 'PLUS会员'
          break;
      }
      return text
    }
  }

}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  /deep/.el-dialog__body {
    padding: 16px;
    background-color: #F5F8FC;
  }
}

.orgInfo {
  .info-row {
    padding: 24px;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 4px;
    .row-title {
      font-weight: 600;
      margin-bottom: 16px;
    }
    .row-label {
      color: #333;
      margin-bottom: 16px;
      .label-time {
        margin-left: 24px;
        font-size: 12px;
        color: #666;
      }
    }
    .row-content {
      display: flex;
      .content-item {
        flex: 1;
        font-size: 14px;
        .item-name {
          display: inline-block;
          width: 70px;
          margin-right: 40px;
        }
        .item-text {
          display: inline-block;
          width: 100px;
        }
        p {
          line-height: 30px;
          color: #666;
        }
        .item-title {
          font-weight: 600;
          margin-bottom: 10px;
        }
        .item-container {
          display: flex;
          .con-item {
            flex: 1;
            text-align: center;
            .con-name {
              color: #666;
              margin-bottom: 10px;
            }
            .con-num {
              color: #333;
              font-size: 30px;
              font-weight: 600;
              margin-bottom: 10px;
            }
            .con-text {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
  .text-color {
    color: #1985FF;
    cursor: pointer;
  }
}
</style>