<template>
  <div class="wapper">
    <h2>订单详情</h2>
    <div class="pannelT">
      <h3>
        订单状态：
        <span class="s1" v-html="getOrderState(form.operStatus)"></span>
      </h3>
      <dl>
        <dt>下单人信息</dt>
        <dd>下单人姓名：{{form.userName}}</dd>
        <dd>下单人手机号：{{form.userMobile}}</dd>
        <!-- <dd>下单人所属分组：{{form.groupName}}</dd> -->
        <dd>下单时间：{{form.cashtime}}</dd>
      </dl>
      <dl v-if="form.orderType==7">
        <dd>— — — — — — — — — — — —</dd>
      </dl>
      <dl v-else>
        <dd>收货人：{{form.receiver}}</dd>
        <dd>收货人手机号：{{form.receiverPhone}}</dd>
        <dd>收货地址：{{form.address}}</dd>
      </dl>
      <dl>
        <dt>支付信息</dt>
        <!-- <dd>
          用户支付方式：
          <span>{{form.cashAmount == null || form.cashAmount == 0 ? '余额支付' : '组合支付'}}</span>
        </dd>
        <dd  v-show="payNo!=''">
          支付流水号：<el-tooltip width="230px" placement="top">
            <div slot="content">
              仅驿宝通财务去支付平台退款用
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <span>{{payNo}}</span>
        </dd> <br /> -->
        <!-- <dd>
          用户支付金额：{{form.orderType==1?'0.00':form.payAmountYuan |currency }}元&nbsp;&nbsp;
          <span
            v-if="form.orderType != 1"
          >=（余额：{{form.payAmountYuan - form.cashAmountYuan |currency}}）</span>
          <span v-if="form.payMode!=null">
            +（
            <span v-html="getpayMode(form.payMode)"></span>
            ：{{form.cashAmountYuan}}）
          </span>
          包含运费：{{form.freight}}
        </dd> -->
        <dd>
          终端商城支付金额：<el-tooltip class="item" effect="light" content="按照分销价扣除" placement="top">
              <i class="tip_icon"></i>
            </el-tooltip><span v-html="adddisPrice()"></span>元&nbsp;&nbsp;
          <span>(商品金额：{{form.payDistribYuan==null?'0:00':form.payDistribYuan}})</span>+ <span>(运费：{{form.supplyFreight}})</span>
        </dd>
        <br />
        <dd>
          机构支付金额：<el-tooltip class="item" effect="light" content="按照供应价扣除" placement="top">
              <i class="tip_icon"></i>
            </el-tooltip>
          <span v-html="addPrice()"></span>
          元&nbsp;= （商品金额：{{form.paySupplyYuan |currency}}）+（运费：{{form.supplyFreight}}）+（扣点：{{serviceFee}}）
        </dd>
      </dl>
      <dl>
        <dt>订单信息</dt>
        <dd>所属项目：{{form.siteName}}</dd>
        <dd>渠道订单号：{{form.outTradeNo || '— —'}}</dd>

      </dl>
      <dl>
        <dt>备注</dt>
        <dd v-if="form.remarks!=''">{{form.remarks}}</dd>
        <dd>订单备注：{{form.remarks1}}</dd>
      </dl>
    </div>
    <h2 class="mb20">商品详情</h2>
    <!-- <el-button type="primary" @click="delivery()">发货</el-button> -->
    <div class="pannelM">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;"
        class="mb20"
        :style="{'max-height:500px':tableData.length>5}"
        :header-cell-style="{color:'#333',background:'#F5F7FA'}">
          <el-table-column prop="itemName"  label="商品详情" width="200">
            <template slot-scope="scope">
                  <img :src="form.photo" width="50" v-if="form.orderType==7" />
                  <img :src="scope.row.productPic" width="50" v-else />
                  <span style="width: 120px;display: inline-block;vertical-align: top;">{{scope.row.itemName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="saleNum" label="数量"></el-table-column>
          <el-table-column prop="supplyPrice" label="供应价">
            <template slot-scope="scope">
                <span v-if="form.orderType==7">— — </span>
                <span v-else>{{scope.row.supplyPrice |currency}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="distribPrice" label="分销价"></el-table-column>
          <el-table-column prop="salePrice" label="销售价"></el-table-column>
          <el-table-column prop="itemName" label="订单类型">
              <template slot-scope="scope">
                <div v-html="valiOrderType(form.orderType)"></div>
              </template>
          </el-table-column>
            <el-table-column prop="supplyName" label="供应商">
            <template slot-scope="scope">
              {{form.orderType==7?'猫眼电影':scope.row.supplyName}}
            </template>
          </el-table-column>
          <el-table-column prop="channelChilerenNo" label="渠道子单号" >
              <template slot-scope="scope">
              {{scope.row.channelChilerenNo || '— — '}}
            </template>
          </el-table-column>
          <el-table-column prop="trackState" label="物流状态">
              <template slot-scope="scope">
                <span v-if="form.orderType==7">— — </span>
                  <span v-else>{{scope.row.trackState}}</span>
              </template>
          </el-table-column>
           <el-table-column prop="operStatus" label="售后状态">
              <template slot-scope="scope">
                  <span v-html="getOperStatus(scope.row.operStatus)"></span>
              </template>
           </el-table-column>
          <el-table-column prop="trackState" label="操作" width="200">
              <template slot-scope="scope">
                <div v-if="roleType==2 && scope.row.operStatus==3">
                  <el-popover placement="top" width="1000" v-model="scope.row.visible"  v-if="scope.row.operStatus!=null">
                    <div class="vcontent">
                        <div class="vl">
                        <ul>
                          <li v-for="(item,index) in auditLists" :key="index">
                            <i></i>
                            <h2>{{item.operStatusName}} <span>{{item.endTime==null?item.startTime:item.endTime}}</span></h2>
                            <p v-html="getcontent(item.operStatus)"></p>
                            <p v-if="item.operStatus==3">
                              物流信息：{{setExpress.expressCompanyName}} {{setExpress.expressNumber}}
                            </p>
                              <!--售后物流 -->
                              <el-popover placement="right" width="400" trigger="hover" v-if="item.operStatus==3" >
                                <div  style="height:400px;overflow-y:scroll;">
                                  <light-timeline :items="logisticslist"></light-timeline>
                                </div>
                                <el-button slot="reference" type="text" size="mini">查看</el-button>
                              </el-popover>
                            <el-button type="text" size="mini" @click="importdanhao(item,1)" v-if="item.operStatus==2 && finaaloperStatus==2" >录入单号</el-button>
                            <el-button type="text" size="mini" @click="importdanhao(item,0)" v-if="item.operStatus==3 && finaaloperStatus!=5 ">修改</el-button>
                            <div v-if="item.operStatus==1 && item.approvalJson==null">
                                <el-radio v-model="confirm" label="0">供应商未发货</el-radio>
                                <el-radio v-model="confirm" label="1">供应商已发货</el-radio>
                                <br><span style="font-size:12px;padding-top:10px;color:red;display: block;">务必与供应商确认是否已发货，否则将会导致退款错误！</span>
                            </div>
                            <!--  item.operStatus==1 && item.approvalJson==null || item.operStatus==4 && item.approvalJson!='' || item.operStatus==3 -->
                            <div  class="d1" v-if="finaaloperStatus==3 && item.operStatus==3 || finaaloperStatus==1 && item.operStatus==1 || finaaloperStatus==4 && item.operStatus==4 ">
                                <el-button type="success" size="mini" @click="shouhoustate(item,1)" :disabled="disabled">通过</el-button>
                                <el-button type="danger" size="mini" @click="shouhoustate(item,2)" :disabled="disabled">不通过</el-button>
                                <el-button type="info" size="mini" @click="shouhoustate(item,4)" :disabled="disabled">撤销</el-button>
                            </div>
                          </li>
                        </ul>
                          <div class="d1">
                                退款原因：{{saasOrderAfterServ.reason}}<br/>
                                 <div  v-if="finaaloperStatus>3 && finaaloperStatus!=14 && finaaloperStatus!=15">
                                  <span v-if="source!=2"> 退给会员：{{saasOrderAfterServ.refundOrgAmount/100}}<br/></span>
                                退给商城：{{saasOrderAfterServ.refundSiteAmount/100}}<br/>
                                退给用户：{{saasOrderAfterServ.totalprice}} （现金:{{saasOrderAfterServ.refundCashAmount/100}}；余额:{{saasOrderAfterServ.refundPointAmount/100}}；运费:{{saasOrderAfterServ.refundFeight/100}}）<br/>
                                </div>
                                联系电话：{{saasOrderAfterServ.mobile}}<br/>
                                问题描述：{{saasOrderAfterServ.description}}<br/>
                                图片：
                                <el-tooltip placement="top" effect="light" v-for="(itemd,indexb) in saasOrderAfterServ.fileAttachment" :key="indexb" >
                                  <div slot="content">
                                    <img :src="itemd.src" alt=""  width="300">
                                  </div>
                                <img :src="itemd.src" alt=""  width="50">
                                </el-tooltip>
                          </div>
                        </div>
                        <div class="vr">
                          <h3>售后流程说明 <span>{{sourcePhone}}</span></h3>
                          <el-row :gutter="12" class="el-cardlist">
                            <el-col :span="8">
                              <el-card shadow="never">
                                1，首次电话联系供应商
                                <p class="p2">确认：是否可退货，是否已发货确认后在系统内操作是否通过</p>
                              </el-card>
                            </el-col>
                            <el-col :span="8">
                              <el-card shadow="never">
                                2，再次电话联系供应商
                                <p class="p2">确认：是否已退款，可退款通过后在系统内操作是否通过</p>
                              </el-card>
                            </el-col>
                            <el-col :span="8">
                              <el-card shadow="never">
                                3，驿宝通平台审核
                                <p class="p2">若非自有供应商渠道商品，则需驿宝通审核，否则直接完成售后</p>
                              </el-card>
                            </el-col>
                          </el-row>
                          <p class="p1">退货原因是质量问题，用户将商品寄回而产生的运费需线下沟通处理，不体现在系统内</p>
                        </div>
                    </div>
                    <el-button type="text"  size="mini" slot="reference" @click="shouhou(scope.row)" :ref="scope.row.serNo">售后详情</el-button>
                  </el-popover>
                </div>
                <div v-if="roleType==1">
                  <el-button type="text" size="mini" @click="applyCustomerService(scope.row)" v-if="form.operStatus==22 && scope.row.operStatus==null || form.operStatus==23 && scope.row.operStatus==null"  :ref="scope.row.orderSubno">申请售后</el-button>
                  <!-- v-if="scope.row.afterOperStatus!=null" -->
                  <el-popover placement="top" width="1000" v-model="scope.row.visible"  v-if="scope.row.operStatus!=null">
                    <div class="vcontent">
                        <div class="vl">
                        <ul>
                          <li v-for="(item,index) in auditLists" :key="index">
                            <i></i>
                            <h2>{{item.operStatusName}} <span>{{item.endTime==null?item.startTime:item.endTime}}</span></h2>
                            <p v-html="getcontent(item.operStatus)"></p>
                            <p v-if="item.operStatus==3">
                              物流信息：{{setExpress.expressCompanyName}} {{setExpress.expressNumber}}
                            </p>
                              <!--售后物流 -->
                              <el-popover placement="right" width="400" trigger="hover" v-if="item.operStatus==3" >
                                <div  style="height:400px;overflow-y:scroll;">
                                  <light-timeline :items="logisticslist"></light-timeline>
                                </div>
                                <el-button slot="reference" type="text" size="mini">查看</el-button>
                              </el-popover>
                            <el-button type="text" size="mini" @click="importdanhao(item,1)" v-if="item.operStatus==2 && finaaloperStatus==2">录入单号</el-button>
                            <el-button type="text" size="mini" @click="importdanhao(item,0)" v-if="item.operStatus==3 && finaaloperStatus!=5 ">修改</el-button>
                            <div v-if="item.operStatus==1 && item.approvalJson==null">
                                <el-radio v-model="confirm" label="0">供应商未发货</el-radio>
                                <el-radio v-model="confirm" label="1">供应商已发货</el-radio>
                                <br><span style="font-size:12px;padding-top:10px;color:red;display: block;">务必与供应商确认是否已发货，否则将会导致退款错误！</span>
                            </div>
                            <!--  item.operStatus==1 && item.approvalJson==null || item.operStatus==4 && item.approvalJson!='' || item.operStatus==3 -->
                            <div  class="d1" v-if="finaaloperStatus==3 && item.operStatus==3 || finaaloperStatus==1 && item.operStatus==1 ||userInfo=='0/1/' && createUserId==1 && finaaloperStatus==4 && item.operStatus==4">
                              <div>
                                  <el-button type="success" size="mini" @click="shouhoustate(item,1)" :disabled="disabled">通过</el-button>
                                  <el-button type="danger" size="mini" @click="shouhoustate(item,2)" :disabled="disabled">不通过</el-button>
                                  <el-button type="info" size="mini" @click="shouhoustate(item,4)" :disabled="disabled">撤销</el-button>
                              </div>
                            </div>
                          </li>
                        </ul>
                          <div class="d1">
                                退款原因：{{saasOrderAfterServ.reason}}<br/>
                                <div  v-if="finaaloperStatus>3 && finaaloperStatus!=14 && finaaloperStatus!=15">
                                  <span v-if="source!=2"> 退给会员：{{saasOrderAfterServ.refundOrgAmount/100}}<br/></span>
                                  退给商城：{{saasOrderAfterServ.refundSiteAmount/100}}<br/>
                                  退给用户：{{saasOrderAfterServ.totalprice}} （现金:{{saasOrderAfterServ.refundCashAmount/100}}；余额:{{saasOrderAfterServ.refundPointAmount/100}}；<span >运费{{saasOrderAfterServ.refundFeight/100}}</span>）<br/>
                                </div>
                                联系电话：{{saasOrderAfterServ.mobile}}<br/>
                                问题描述：{{saasOrderAfterServ.description}}<br/>
                                图片：
                                <el-tooltip placement="top" effect="light" v-for="(itemd,indexb) in saasOrderAfterServ.fileAttachment" :key="indexb" >
                                  <div slot="content">
                                    <img :src="itemd.src" alt=""  width="300">
                                  </div>
                                <img :src="itemd.src" alt=""  width="50">
                                </el-tooltip>
                          </div>
                        </div>
                        <div class="vr">
                          <h3>售后流程说明 <span>{{sourcePhone}}</span></h3>
                          <el-row :gutter="12" class="el-cardlist">
                            <el-col :span="8">
                              <el-card shadow="never">
                                1，首次电话联系供应商
                                <p class="p2">确认：是否可退货、是否已发货，确认后在系统内操作是否通过</p>
                              </el-card>
                            </el-col>
                            <el-col :span="8">
                              <el-card shadow="never">
                                2，再次电话联系供应商
                                <p class="p2">确认：是否已退款、可退款，通过后在系统内操作是否通过</p>
                              </el-card>
                            </el-col>
                            <el-col :span="8">
                              <el-card shadow="never">
                                3，驿宝通平台审核
                                <p class="p2">若非自有供应商渠道商品，则需驿宝通审核，否则直接完成售后</p>
                              </el-card>
                            </el-col>
                          </el-row>
                          <p class="p1">退货原因是质量问题，用户将商品寄回而产生的运费需线下沟通处理，不体现在系统内</p>
                        </div>
                    </div>
                    <el-button type="text"  size="mini" slot="reference" @click="shouhou(scope.row)" :ref="scope.row.serNo" >售后详情</el-button>
                  </el-popover>
                </div>

              </template>
          </el-table-column>
      </el-table>
    </div>
    <h2>包裹信息</h2>
    <div v-if="form.orderType==7" style="margin-top:20px">— — — — — — — — —— — — — — —</div>
    <div v-else>
      <div v-if="source===2 || source===102 ">
        <div class="order-nav">
          <ul class="boxPannel">
            <li
              v-for="(item,index) in itemList"
              :key="index"
              :class="{'active':item.select==true}"
              @click="selectBox(item)"
            >包裹{{index+1}}</li>
          </ul>
          <div
            class="goodsInfo"
            v-for="(item,index) in itemList"
            :key="index"
            v-show="item.select==true"
          >
            <div class="goodsInfo-t">
              <!-- <span>供应商：{{item.supplier}}</span> -->
              <span>物流公司：{{item.type==0?'自配送':item.comName}}&nbsp;&nbsp;&nbsp;&nbsp;快递单号：{{item.nu}}</span>
              <el-button
                type="text"
                @click="updataNo(item)"
                v-if="item.type!=0 && roleType!=1"
                style="font-size:12px"
                class="ml10"
              >修改单号</el-button>
              <el-button
                type="text"
                @click="updataPhone(item)"
                v-if="item.type==0 && roleType!=1"
                style="font-size:12px"
                class="ml10"
              >修改电话</el-button>
            </div>
            <div class="goodsInfo-c" v-for="(itemA,indexA) in item.orderDetailList" :key="indexA">
              <img :src="itemA.productPic" width="100" height="100" />
              <p>
                {{itemA.itemName}}
                <!-- <br />1条装*1 -->
              </p>
            </div>
            <div class="goodsInfo-b"  v-if="item.activities.length>0">
              <div class="block">
                <light-timeline :items="item.activities"></light-timeline>
              </div>
            </div>
            <div v-else style="text-align:center;margin-top:10px;">
               <img src="../img/noOrder.jpg" style="width:240px"/><br>
              请核实填写的物流单号是否准确或物流公司还未录入系统！可点击修改再次输入！</div>
          </div>
        </div>
        <div class="notrack">{{trackInfo}}</div>
      </div>
      <div v-else>
        <div class="order-nav">
          <ul class="boxPannel">
            <li
              v-for="(item,index) in itemList"
              :key="index"
              :class="{'active':item.select==true}"
              @click="selectBox(item)"
            >包裹{{index+1}}</li>
          </ul>
          <div
            class="goodsInfo"
            v-for="(item,index) in itemList"
            :key="index"
            v-show="item.select==true"
          >
            <div class="goodsInfo-t">
              <!-- <span>供应商：{{item.supplier}}</span>&nbsp;&nbsp; -->
              <span>渠道子单号：{{item.packageId || '---'}}</span>
              <!-- <span>物流公司：{{item.express}}&nbsp;&nbsp;&nbsp;&nbsp;快递单号：{{item.packageId}}</span> -->
            </div>
            <div class="goodsInfo-c" v-for="(itemA,indexA) in item.orderDetailList" :key="indexA">
              <img :src="itemA.productPic" width="100" height="100" />
              <p>
                {{itemA.name}}
                <!-- <br />1条装*1 -->
              </p>
            </div>
            <div class="goodsInfo-b">
              <div class="block">
                <light-timeline :items="item.activities" class="lineContent"></light-timeline>
              </div>
            </div>
          </div>
        </div>
        <div class="notrack">{{trackInfo}}</div>
      </div>
    </div>
    <!-- <addNewTag ref="addNewTag"></addNewTag> -->
    <!-- <delivery ref="delivery"></delivery> -->
    <!-- 修改快递 -->
    <el-dialog title="修改" :visible.sync="dialogDelivery" width="600px" :closeOnClickModal="false">
      <el-form ref="form" :model="formDelivery" class="formPannel">
        <el-form-item label="物流公司" class="formItem" label-width="80px">
          <el-select
            v-model="formDelivery.region"
            class="w140"
            placeholder="全部"
            @change="getexpress"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item,index) in formDelivery.formDeliveryList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" class="formItem" label-width="80px" v-if="type==1">
          <el-input v-model.trim="formDelivery.name" placeholder="请填写快递单号" class="w150"></el-input>
        </el-form-item>
        <el-form-item label="配送员电话" class="formItem" label-width="90px" v-if="type==0">
          <el-input v-model.trim="formDelivery.tel" placeholder class="w150"></el-input>
        </el-form-item>
        <el-form-item class="textRight" label-width="10px">
          <el-button @click="dialogDelivery=false">取消</el-button>
          <el-button type="primary" @click="sure"  :disabled="disabled">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 申请售后 -->
    <el-dialog title="申请售后" :visible.sync="showapplyCustomerService" width="800px" :closeOnClickModal="false" class="applyCustomerStyle">
      <el-form ref="form" :model="apply" class="formPannel">
        <el-alert
        title="请按照与用户沟通的实际结果录入"
        type="warning"
        :closable="true"
        show-icon style="margin-bottom:20px"/>

        <!-- <el-form-item label="退货类型"  label-width="80px">
          <el-select
            v-model="apply.type"
            class="w140"
            placeholder="全部">
            <el-option  label="退货" value="1"></el-option>
            <el-option  label="换货" value="2"></el-option>
          </el-select>
          <span>退货退款表示供应商已发货需退回商品，仅退款表示未发货</span>
        </el-form-item> -->
        <el-form-item label="退货原因"  label-width="80px">
          <el-select
            v-model="apply.rerson"
            class="w140"
            placeholder="全部"
          >
            <el-option  label="质量原因" value="质量原因"></el-option>
            <el-option  label="商品发错货" value="商品发错货"></el-option>
            <el-option  label="商品损坏" value="商品损坏"></el-option>
            <el-option  label="不想要了" value="不想要了"></el-option>
            <el-option  label="商品降价" value="商品降价"></el-option>
            <el-option  label="质量商品与描述不符" value="质量商品与描述不符"></el-option>
            <el-option  label="缺少件" value="缺少件"></el-option>
            <el-option  label="其他原因" value="其他原因"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="退货数量"  label-width="80px">
         <!-- {{apply.num}} -->
         <el-input-number v-model="apply.num" @change="handleChange" :min="1" :max="numMax" label="描述文字" class="w140"></el-input-number>
        </el-form-item>
        <el-form-item label="问题描述" label-width="80px">
          <el-input type="textarea" v-model="apply.description" placeholder=""></el-input>
        </el-form-item>
        <el-form-item class="textRight" label-width="10px">
          <el-button @click="showapplyCustomerService=false">取消</el-button>
          <el-button type="primary" @click="sureapply" :disabled="disabled">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 录入快递单号 -->
     <el-dialog title="录入单号" :visible.sync="showapplyDelivery" width="600px" :closeOnClickModal="false">
      <el-form ref="form" :model="setExpress" class="formPannel">
        <el-form-item label="物流公司" class="formItem" label-width="80px">
          <el-select
            v-model="setExpress.expressCompany"
            class="w140"
            placeholder="全部"
            @change="getexpress">
            <el-option
              :label="item.name"
              :value="item.id"
              v-show="item.id!='zps'"
              v-for="(item,index) in formDelivery.formDeliveryList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" class="formItem" label-width="80px" v-if="type==1">
          <el-input v-model.trim="setExpress.expressNumber" placeholder="请填写快递单号" class="w150"></el-input>
        </el-form-item>
        <el-form-item class="textRight" label-width="10px">
          <el-button @click="showapplyDelivery=false">取消</el-button>
          <el-button type="primary" @click="sureapplysetExpress" :disabled="disabled">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import delivery from '@/components/delivery/delivery';
// import addNewTag from '@/components/delivery/addNewTag';
import { accAdd } from '@/utils/index'

export default {
  name: 'orderList',
  data () {
    return {
      logisticslist: [],
      disabled: false,
      reverse: true,
      showapplyCustomerService: false,
      auditLists: [],
      formDelivery: {
        region: '',
        name: '',
        tel: '',
        formDeliveryList: []
      },
      apply: {
        type: '',
        rerson: '',
        num: '0',
        description: '',
        orderNo: '',
        orderSubno: ''
      },
      setExpress: {
        id: '',
        expressCompany: '',
        expressNumber: ''
      },
      type: 1,
      expressId: '',
      dialogDelivery: false,
      showapplyDelivery: false,
      supplier: '',
      express: '',
      expressNo: '',
      gridData: [],
      dialogTableVisible: false,
      orderNo: this.$route.query.orderNo,
      tableData: [],
      activities: [],
      itemList: [],
      form: {
        desc: ''
      },
      trackInfo: '',
      source: '',
      serviceFee: '0.00',
      orgId: '',
      roleType: '',
      payNo: '',
      saasOrderAfterServ: { },
      confirm: '',
      isNext: 0,
      finaaloperStatus: '',
      sourcePhone: '',
      orderDetailList: this.$route.query.orderDetailList,
      userInfo: '',
      createUserId: '',
      numMax:1
    }
  },
  created () {
    console.log(this.orderDetailList)
    this.deliveryMobilePass = ''
    this.typePass = ''
    this.roleType = Number(localStorage.getItem('roleType'))
    this.mallSiteInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.userInfo = this.mallSiteInfo.sysOrganization.parentIds
    this.createUserId = this.mallSiteInfo.createUserId
    console.log(this.userInfo)
    this.delivery()
    this.queryComList()
    this.orderId = ''
  },
  watch: {
    // dialogDelivery () {
    //   if (this.dialogDelivery === false) {
    //     this.formDelivery.name = ''
    //     this.formDelivery.tel = ''
    //     this.formDelivery.region = ''
    //   }
    // },
    // showapplyCustomerService () {
    //   this.apply.type = ''
    //   this.apply.rerson = ''
    //   this.apply.description = ''
    // }
  },
  methods: {
    handleChange (value) {
      this.apply.num = value
      console.log(value)
    },
    dingwei () {
      if (this.orderDetailList !== undefined) {
        this.orderDetailList = JSON.parse(this.orderDetailList)
        this.orderDetailList.visible = true
        setTimeout(() => {
          this.$nextTick(() => {
            if (this.orderDetailList.serNo !== null) {
              this.$refs[this.orderDetailList.serNo].$listeners.click()
            } else {
              this.$refs[this.orderDetailList.orderSubno] === undefined ? '' : this.$refs[this.orderDetailList.orderSubno].$listeners.click()
            }
          })
        }, 1000)
      }
    },
    lookwuiu () {
      this.logistics()
    },
    // 物流
    logistics () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/saasOrderAfterServ/logistics'),
        method: 'post',
        data: this.$http.adornData(
          {
            id: this.setExpress.id
          }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          for (let index = 0; index < res.data.list[0].data.data.length; index++) {
            const element = res.data.list[0].data.data[index]
            this.logisticslist.push(
              {
                tag: element.time,
                content: element.context,
                color: '#1985FF'
              })
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    getcontent (item) {
      // operStatus   工单处理状态：0新建，1待会员处理，2待用户邮寄，
      // 3待供应商确认，4待平台审核，5已完成，14未通过，15用户撤销，16过期取消,99完成归档
      switch (item) {
        case 0:
          return '您已成功发起退款申请，请耐心等待商家处理'
        case 1:
          return '用户提交了售后申请，等待供应商通过'
        case 2:
          return '供应商通过了用户售后申请，等待用户邮寄退货'
        case 3:
          return '用户已邮寄退货，待供应商确认是否已退款/可退款'
        case 4:
          return '供应商通过了用户售后申请，待驿宝通平台审核'
        case 5:
          return '已退款，本次售后已完成' // 供应商通过了用户售后申请，已退款，本次售后已完成or
        case 14:
          return '供应商未通过用户的售后申请，无法退款，本次售后已完成'
        case 15:
          return '售后已撤销，无法退款，本次售后完成'
        case 16:
          return '过期取消'
        case 99:
          return '完成归档'
      }
    },
    // 工单记录  /ybt-backend/order/saasOrderAfterSupport/auditList
    auditList (item) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/saasOrderAfterSupport/auditList'),
        method: 'post',
        data: this.$http.adornData(
          {
            serNo: item.serNo
          }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.auditLists = res.data.list
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    importdanhao (item, type) {
      this.showapplyDelivery = true
      this.isNext = type
    },
    // 录入单号
    sureapplysetExpress () {
      this.disabled = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/saasOrderAfterServ/setExpress'),
        method: 'post',
        data: this.$http.adornData(
          {
            id: this.setExpress.id,
            isNext: this.isNext,
            expressNumber: this.setExpress.expressNumber,
            expressCompanyName: this.setExpress.expressCompanyName,
            expressCompany: this.setExpress.expressCompany
          })
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.$message.success('录入成功')
          this.showapplyDelivery = false
          this.delivery()
        } else {
          this.$message.error(res.data.msg)
        }
        this.disabled = false
      })
    },
    getOperStatus (item) {
      switch (item) {
        case null:
          return '未申请'
        case 0:
          return '新建'
        case 1:
          return '待会员处理'
        case 2:
          return '待用户邮寄'
        case 3:
          return '待供应商确认'
        case 4:
          return '待平台审核'
        case 5:
          return '已完成'
        case 14:
          return '已拒绝'
        case 15:
          return '已撤销'
        case 16:
          return '过期取消'
        case 99:
          return '完成归档'
      }
    },
    valiOrderType (item) {
      switch (item) {
        case 1:
          return '礼包订单'
        case 2:
          return '商品订单'
        case 3:
          return '限时秒杀'
        case 4:
          return '拼团订单'
        case 5:
          return '分期订单'
        case 6:
          return '虚拟商品订单'
        case 7:
          return '电影订单'
        case 8:
          return '虚拟商品订单'
      }
    },
    shouhoustate (item, type) {
      if (item.operStatus !== 4 && item.operStatus !== 3) {
        if (this.confirm === '' && type === 1) {
          return this.$message.error('请先确认是否已发货')
        }
      }
      var approvalJson = ''
      if (item.operStatus === 4) {
        approvalJson = ''
      } else if (type === 2 || type === 4) {
        approvalJson = JSON.stringify({
          operstatus: '1',
          confirm: 0
        })
      } else {
        approvalJson = JSON.stringify({
          operstatus: '1',
          confirm: this.confirm
        })
      }
      this.disabled = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/saasOrderAfterSupport/openAudit'),
        method: 'post',
        data: this.$http.adornData(
          {
            id: item.id,
            approvalJson: approvalJson,
            approvalStatus: type
          })
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.delivery()
          this.$message.success('提交成功')
          this.disabled = false
        } else {
          this.$message.error(res.data.msg)
          this.delivery()
          this.disabled = false
        }
      })
    },
    shouhou (item) {
      item.visible = true
      this.sourcePhone = item.source === 1 ? '京东售后电话：400-606-6866' : item.source === 3 ? '苏宁易购售后电话：4008-516-516' : item.source === 4 ? '网易严选售后电话：400-0368-163' : ''
      this.auditList(item)
      this.saasOrderAfterServinfo(item)
    },
    // 查询售后详情
    saasOrderAfterServinfo (item) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/saasOrderAfterServ/info'),
        method: 'post',
        data: this.$http.adornData(
          {
            orderSubno: item.orderSubno
          }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.saasOrderAfterServ = res.data.saasOrderAfterServ
          this.saasOrderAfterServ.totalprice = ''
          this.saasOrderAfterServ.totalprice = (this.saasOrderAfterServ.refundAmount + this.saasOrderAfterServ.refundFeight) / 100
          this.setExpress.id = this.saasOrderAfterServ.id
          this.setExpress.expressCompany = this.saasOrderAfterServ.expressCompany
          this.setExpress.expressCompanyName = this.saasOrderAfterServ.expressCompanyName
          this.setExpress.expressNumber = this.saasOrderAfterServ.expressNumber
          this.finaaloperStatus = this.saasOrderAfterServ.operStatus
          var fileAttachment = []
          var fileimgs = res.data.saasOrderAfterServ.fileAttachment == null ? [] : res.data.saasOrderAfterServ.fileAttachment.split(',')
          for (let index = 0; index < fileimgs.length; index++) {
            const element = fileimgs[index]
            fileAttachment.push({
              src: element
            })
          }
          this.saasOrderAfterServ.fileAttachment = fileAttachment
          if (this.setExpress.expressNumber != null) {
            this.lookwuiu()
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 申请售后
    applyCustomerService (item) {
      console.log(item)
      this.apply.num = item.saleNum
      this.numMax = item.saleNum
      this.apply.orderNo = item.orderNo
      this.apply.orderSubno = item.orderSubno
      this.showapplyCustomerService = true
    },
    queryComList () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/order/queryComList'),
        method: 'post',
        data: ''
      }).then((res) => {
        if (res && res.data.code === 1) {
          var obj = res.data.obj
          for (var key in obj) {
            this.formDelivery.formDeliveryList.push({
              id: key,
              name: obj[key],
              type: 1
            })
          }
          var item = {
            id: 'zps',
            name: '自配送',
            type: 0
          }
          this.formDelivery.formDeliveryList.splice(0, 0, item)
          console.log(this.formDelivery.formDeliveryList)
        } else {

        }
      })
    },
    // 申请售后
    sureapply () {
      this.disabled = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/saasOrderAfterServ/openApply'),
        method: 'post',
        data: this.$http.adornData(
          {
            type: 1,
            reason: this.apply.rerson,
            num: this.apply.num,
            description: this.apply.description,
            orderNo: this.apply.orderNo,
            orderSubno: this.apply.orderSubno
          })
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.$message.success('保存成功')
          this.showapplyCustomerService = false
          this.delivery()
          this.disabled = false
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    sure () {
      if (this.formDelivery.region === '') {
        this.$message.error('请选择物流公司')
        return false
      }

      if (this.formDelivery.name === '' && this.type === 1) {
        this.formDelivery.tel = ''
        this.$message.error('请填写快递单号')
        return false
      }
      if (this.formDelivery.tel === '' && this.type === 0) {
        this.formDelivery.name = ''
        this.$message.error('请填写快递员电话')
        return false
      }
      this.formDelivery.name = this.formDelivery.name.replace(/\s/g, '')
      this.disabled = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/order/uptdistrib'),
        method: 'post',
        data: this.$http.adornData(
          {
            expressNo: this.expressNo,
            orderId: this.orderId,
            deliveryMobile: this.deliveryMobilePass,
            express: this.formDelivery.region,
            type: this.typePass,
            typeUpt: this.type,
            deliveryMobileUpt: this.formDelivery.tel,
            expressNoUpt: this.formDelivery.name
          }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.dialogDelivery = false
          this.$message.success('保存成功')
          this.formDelivery.tel = ''
          this.formDelivery.name = ''
          this.formDelivery.region = ''
          this.delivery()
        } else {
          this.trackInfo = '请核实填写的物流单号是否准确或物流公司还未录入系统！可点击修改再次输入！'
        }
        this.disabled = false
      })
    },
    getexpress (id) {
      if (id === 'zps') {
        this.type = 0
        this.expressId = ''
      } else {
        this.type = 1
        this.expressId = id
      }
      this.setExpress.expressCompanyName = this.formDelivery.formDeliveryList.filter(item => item.id === this.expressId)[0].name
      console.log(this.expressId)
    },

    updataNo (item) {
      this.typePass = item.type
      this.type = item.type
      this.expressNo = item.nu
      this.formDelivery.region = item.data.com
      this.formDelivery.name = item.nu
      this.dialogDelivery = true
    },
    updataPhone (item) {
      this.typePass = item.type
      this.type = item.type
      this.formDelivery.region = 'zps'
      this.expressNo = item.expressNo
      this.formDelivery.tel = item.deliveryMobile
      this.dialogDelivery = true
    },
    adddisPrice () {
      if (this.form.payDistribYuan === undefined || this.form.supplyFreight === undefined) {
        return false
      }
      let a = accAdd(this.form.payDistribYuan == null ? '0' : this.form.payDistribYuan, this.form.supplyFreight)
      return a
    },
    addPrice () {
      if (this.form.paySupplyYuan === undefined || this.form.supplyFreight === undefined) {
        return false
      }
      let a = accAdd(this.form.paySupplyYuan, this.form.supplyFreight)
      return accAdd(a, this.serviceFee)
    },
    getserviceFee () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/open/order/queryApiServFee'),
        method: 'post',
        data: this.$http.adornData(
          {
            orderNo: this.orderNo,
            orgId: this.orgId
          }, true)
      }).then((data) => {
        if (data && data.data.code === 0) {
          var serviceFee = data.data.serviceFee
          this.payNo = data.data.payNo === undefined ? '' : data.data.payNo
          this.serviceFee = serviceFee === undefined ? '' : serviceFee.replace('-', '')
        }
      })
    },
    selectBox (item) {
      for (let index = 0; index < this.itemList.length; index++) {
        const element = this.itemList[index]
        element.select = false
      }
      item.select = true
    },
    delivery () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/order/queryOrderDetail'),
        method: 'post',
        data: this.$http.adornData(
          {
            orderNo: this.orderNo
          }, true)
      }).then((data) => {
        if (data && data.data.code === 0) {
          var res = data.data
          this.source = res.order.source || res.order.orderDetailList[0].source
          this.form = res.order
          this.orgId = res.order.orgId
          this.orderId = res.order.id
          console.log(this.orgId)
          for (let index = 0; index < res.order.orderDetailList.length; index++) {
            const element = res.order.orderDetailList[index]
            element.productPic = element.source === 1 ? 'http://img13.360buyimg.com/n1/' + element.productPic : element.productPic
            element.trackState = element.trackState === 0 ? '未发货' : '已发货'
            element.visible = false
          }
          this.tableData = res.order.orderDetailList
          this.dingwei()
          if (this.source === 2 || this.source === 102) {
            if (res.track && res.track.list.length > 0) {
              for (let i = 0; i < res.track.list.length; i++) {
                const itemA = res.track.list[i]
                itemA.select = false
                if (i === 0) {
                  itemA.select = true
                }
                itemA.activities = []
                if (itemA.type === 0) {
                  itemA.activities.push(
                    {
                      tag: itemA.deliveryTime,
                      content: '订单已交由配送员，电话：' + itemA.deliveryMobile,
                      color: '#3ac691'
                    },
                    {
                      tag: itemA.deliveryTime,
                      content: '订单已支付，待发货',
                      color: '#dddddd'
                    })
                } else {
                  var itemList = itemA.data.data
                  for (let j = 0; j < itemList.length; j++) {
                    const itemB = itemList[j]
                    itemA.activities.push({
                      tag: itemB.ftime,
                      content: itemB.context,
                      color: j === 0 ? '#3ac691' : '#dddddd'
                    })
                  }
                }
                itemA.supplier = res.track.supplyName
                itemA.nu = itemA.type === 0 ? '' : itemA.data.nu
                itemA.type = itemA.type
                itemA.comName = itemA.type === 0 ? '' : itemA.data.comName
                itemA.deliveryMobile = itemA.type === 0 ? itemA.deliveryMobile : itemA.data.deliveryMobile
                itemA.deliveryTime = itemA.type === 0 ? itemA.deliveryTime : itemA.data.deliveryTime
                for (let indexA = 0; indexA < itemA.orderDetailList.length; indexA++) {
                  const elementA = itemA.orderDetailList[indexA]
                  elementA.productPic = elementA.source === 1 ? 'http://img13.360buyimg.com/n1/' + elementA.productPic : elementA.productPic
                }
              }
              this.itemList = res.track.list
              this.deliveryMobilePass = this.itemList[0].deliveryMobile === undefined ? '' : this.itemList[0].deliveryMobile
              console.log(this.itemList)
            } else {
              this.trackInfo = '暂无物流信息'
            }
          } else {
            if (res.track.msg.length > 0 && res.track.msg !== '暂无物流信息' && res.track.msg !== '订单取消，无物流信息') {
              for (let i = 0; i < res.track.msg.length; i++) {
                const itemA = res.track.msg[i]
                itemA.select = false
                if (i === 0) {
                  itemA.select = true
                }
                itemA.activities = []
                itemA.orderDetailList = []
                for (let j = itemA.itemList.length - 1; j >= 0; j--) {
                  const itemB = itemA.itemList[j]
                  itemA.activities.push({
                    tag: itemB.msgTime,
                    content: itemB.content,
                    color: j === itemA.itemList.length - 1 ? '#3ac691' : '#dddddd'
                  })
                }

                itemA.supplier = res.order.source === 1 ? '京东' : '自有供应商'
                itemA.express = itemA.itemList[0].distrName

                for (let m = 0; m < itemA.logistList.length; m++) {
                  const itemC = itemA.logistList[m]
                  for (let n = 0; n < this.tableData.length; n++) {
                    if (itemC.skuId === this.tableData[n].itemCode) {
                      itemA.orderDetailList.push({
                        name: this.tableData[n].itemName,
                        saleNum: this.tableData[n].saleNum,
                        productPic: this.tableData[n].productPic
                      })
                    }
                  }
                }
              }
              this.itemList = res.track.msg
              console.log(this.itemList)
            } else {
              this.trackInfo = '暂无物流信息'
            }
          }
          this.getserviceFee()
        }
      })
    },
    getOrderState (val) {
      switch (val) {
        case 0:
          return '新创建'
        case 4:
          return '撤销'
        case 11:
          return '一级审批'
        case 12:
          return '二级审批'
        case 15:
          return '支付中'
        case 21:
          return '不通过'
        case 22:
          return '待收货'
        case 23:
          return '已完成'
        case 13:
          return '撤销待审核'
        case 31:
          return '退货'
        case 41:
          return '过期取消'
      }
    },
    getpayMode (val) {
      switch (val) {
        case 'ye':
          return '余额支付' // '余额支付'
        case 'wx':
          return '微信支付' // '微信支付'
        case 'ycb':
          return '驿车宝支付' // '驿车宝支付'
        case 'zh_ywt':
          return '招行一网通支付' // '招行一网通支付'
      }
    }
  },
  components: {
    // delivery,
    // addNewTag
  }
}
</script>
<style lang="scss" scoped>
.wapper {
  position: relative;
  background: #ffffff;
  font-size: 12px;
  h2 {
    border-left: 4px solid #3E8EF7;
    font-size: 16px;
    padding-left: 10px;
    color: #3c3c3c;
  }
  .pannelT {
    margin-bottom: 40px;
    margin-top: 20px;
    h3 {
      line-height: 40px;
      font-weight: bold;
      span {
        color: #ff862e;
      }
    }
    dl {
      dt {
        width: 100%;
        line-height: 40px;
        font-weight: bold;
      }
      dd {
        display: inline-block;
        line-height: 40px;
        margin-right: 20px;
        color: #8a979e;
      }
    }
  }
  .pannelM {
    margin-bottom: 40px;
  }
  .order-nav {
    margin-top: 30px;
    ul.boxPannel {
      border-bottom: 1px solid #d7e0f1;
    }
    li {
      min-width: 92px;
      height: 56px;
      line-height: 48px;
      text-align: center;
      top: 2px;
      position: relative;
      border: 1px solid transparent;
      transition: 0.2s ease;
      border-radius: 3px;
      display: inline-block;
      cursor: pointer;
      &.active {
        border: 1px solid #d7e0f1;
        background-color: #fff;
        border-bottom: 2px solid #fff;
      }
    }
  }
  .goodsInfo-t {
    height: 42px;
    background-color: #dee9f7;
    line-height: 42px;
    text-indent: 10px;
    margin: 20px 0;
  }
  .goodsInfo-b{
    /deep/ .line-container {
      .item-tag{
        width: 70px;
      }
      .item-content{
        line-height: 20px;
      }
    }
  }
  .goodsInfo-c {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img,
    p {
      display: inline-block;
    }
    img {
      vertical-align: top;
    }
    p {
      width: 200px;
      display: inline-block;
      line-height: 20px;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // align-items: center;
      padding-left: 20px;
    }
  }
  .add {
    color: #4486f4;
    cursor: pointer;
  }
  .notrack {
    padding: 50px;
    text-align: left;
    font-weight: bold;
  }
  .applyCustomerStyle{
    /deep/ .el-dialog__body{
      padding-top: 0;
      .el-alert.is-light .el-alert__closebtn{
        display: none;
      }
    }
  }
}
 .vcontent{
    .vl{
      width:345px;
      display: inline-block;
      vertical-align: top;
      border-right:#999999 1px solid;
      padding-right:10px;
      ul{
        li{
          border-left:#999999 1px solid;
          padding-left: 20px;
          position: relative;
          i{
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            position: absolute;
            left:-4px;
            top:0;
            background: #666666;
          }
          h2{
            line-height: 1;
            color:#E6A23C;
            span{
              padding:0 10px;
              color:#999999;
            }
          }
          p{
            line-height: 30px;
            padding-top: 5px;
          }
          .d1{
            color:#999999;
            line-height: 20px;
          }
        }
      }
      .d1{
        padding:10px 0;
        color: #999999;
        padding-left: 20px;
        img{
          margin:5px;
          display: inline-block;
        }
      }
    }
    .vr{
      padding-left: 20px;
      width: 570px;
      display: inline-block;
      h3{
        color: #E6A23C;
      }
      /deep/ .el-card__body{
        padding: 20px 20px 0 0;
      }
      p.p2{
        color:#999999;
        font-size: 12px;
        padding: 10px;
      }
      p.p1{
        margin-top: 20px;
        color: #999999;
        font-size: 12px;
      }
      .el-cardlist{
        margin:10px 0;
        /deep/ .el-card{
          border: #f5f5f5 1px solid !important;
          padding:10px;
          width: 200px;
          .el-card__body{
            padding-top:0;
          }
        }
      }
    }
  }
</style>
