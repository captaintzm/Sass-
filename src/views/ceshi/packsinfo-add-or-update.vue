<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="" prop="orgId">
      <el-input v-model="dataForm.orgId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="siteId">
      <el-input v-model="dataForm.siteId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="礼包名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="礼包名称"></el-input>
    </el-form-item>
    <el-form-item label="" prop="ratio">
      <el-input v-model="dataForm.ratio" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="市场价(元)" prop="markPrice">
      <el-input v-model="dataForm.markPrice" placeholder="市场价(元)"></el-input>
    </el-form-item>
    <el-form-item label="销售价(元)" prop="salePrice">
      <el-input v-model="dataForm.salePrice" placeholder="销售价(元)"></el-input>
    </el-form-item>
    <el-form-item label="是否手机端分发（0否，1是）" prop="isMobile">
      <el-input v-model="dataForm.isMobile" placeholder="是否手机端分发（0否，1是）"></el-input>
    </el-form-item>
    <el-form-item label="有效期开始" prop="validStartDate">
      <el-input v-model="dataForm.validStartDate" placeholder="有效期开始"></el-input>
    </el-form-item>
    <el-form-item label="有效期截止" prop="validEndDate">
      <el-input v-model="dataForm.validEndDate" placeholder="有效期截止"></el-input>
    </el-form-item>
    <el-form-item label="视频地址" prop="videoUrl">
      <el-input v-model="dataForm.videoUrl" placeholder="视频地址"></el-input>
    </el-form-item>
    <el-form-item label="封面图" prop="photoUrl">
      <el-input v-model="dataForm.photoUrl" placeholder="封面图"></el-input>
    </el-form-item>
    <el-form-item label="多图" prop="photoSelectUrl">
      <el-input v-model="dataForm.photoSelectUrl" placeholder="多图"></el-input>
    </el-form-item>
    <el-form-item label="是否对下级开放 ：0：不开放 1：开放" prop="isOpenBranch">
      <el-input v-model="dataForm.isOpenBranch" placeholder="是否对下级开放 ：0：不开放 1：开放"></el-input>
    </el-form-item>
    <el-form-item label="商品来源" prop="productSource">
      <el-input v-model="dataForm.productSource" placeholder="商品来源"></el-input>
    </el-form-item>
    <el-form-item label="允许领取商品个数" prop="selectNum">
      <el-input v-model="dataForm.selectNum" placeholder="允许领取商品个数"></el-input>
    </el-form-item>
    <el-form-item label="详情说明" prop="details">
      <el-input v-model="dataForm.details" placeholder="详情说明"></el-input>
    </el-form-item>
    <el-form-item label="祝福标题" prop="shareName">
      <el-input v-model="dataForm.shareName" placeholder="祝福标题"></el-input>
    </el-form-item>
    <el-form-item label="祝福文字" prop="shareContent">
      <el-input v-model="dataForm.shareContent" placeholder="祝福文字"></el-input>
    </el-form-item>
    <el-form-item label="是否显示价格 (0:不显示 1:显示)" prop="isShowPrice">
      <el-input v-model="dataForm.isShowPrice" placeholder="是否显示价格 (0:不显示 1:显示)"></el-input>
    </el-form-item>
    <el-form-item label="礼包状态（0禁用，1启用）" prop="operStatus">
      <el-input v-model="dataForm.operStatus" placeholder="礼包状态（0禁用，1启用）"></el-input>
    </el-form-item>
    <el-form-item label="" prop="createBy">
      <el-input v-model="dataForm.createBy" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="createDate">
      <el-input v-model="dataForm.createDate" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="updateBy">
      <el-input v-model="dataForm.updateBy" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="updateDate">
      <el-input v-model="dataForm.updateDate" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="remarks">
      <el-input v-model="dataForm.remarks" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="status">
      <el-input v-model="dataForm.status" placeholder=""></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          orgId: '',
          siteId: '',
          name: '',
          ratio: '',
          markPrice: '',
          salePrice: '',
          isMobile: '',
          validStartDate: '',
          validEndDate: '',
          videoUrl: '',
          photoUrl: '',
          photoSelectUrl: '',
          isOpenBranch: '',
          productSource: '',
          selectNum: '',
          details: '',
          shareName: '',
          shareContent: '',
          isShowPrice: '',
          operStatus: '',
          createBy: '',
          createDate: '',
          updateBy: '',
          updateDate: '',
          remarks: '',
          status: ''
        },
        dataRule: {
          orgId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          siteId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '礼包名称不能为空', trigger: 'blur' }
          ],
          ratio: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          markPrice: [
            { required: true, message: '市场价(元)不能为空', trigger: 'blur' }
          ],
          salePrice: [
            { required: true, message: '销售价(元)不能为空', trigger: 'blur' }
          ],
          isMobile: [
            { required: true, message: '是否手机端分发（0否，1是）不能为空', trigger: 'blur' }
          ],
          validStartDate: [
            { required: true, message: '有效期开始不能为空', trigger: 'blur' }
          ],
          validEndDate: [
            { required: true, message: '有效期截止不能为空', trigger: 'blur' }
          ],
          videoUrl: [
            { required: true, message: '视频地址不能为空', trigger: 'blur' }
          ],
          photoUrl: [
            { required: true, message: '封面图不能为空', trigger: 'blur' }
          ],
          photoSelectUrl: [
            { required: true, message: '多图不能为空', trigger: 'blur' }
          ],
          isOpenBranch: [
            { required: true, message: '是否对下级开放 ：0：不开放 1：开放不能为空', trigger: 'blur' }
          ],
          productSource: [
            { required: true, message: '商品来源不能为空', trigger: 'blur' }
          ],
          selectNum: [
            { required: true, message: '允许领取商品个数不能为空', trigger: 'blur' }
          ],
          details: [
            { required: true, message: '详情说明不能为空', trigger: 'blur' }
          ],
          shareName: [
            { required: true, message: '祝福标题不能为空', trigger: 'blur' }
          ],
          shareContent: [
            { required: true, message: '祝福文字不能为空', trigger: 'blur' }
          ],
          isShowPrice: [
            { required: true, message: '是否显示价格 (0:不显示 1:显示)不能为空', trigger: 'blur' }
          ],
          operStatus: [
            { required: true, message: '礼包状态（0禁用，1启用）不能为空', trigger: 'blur' }
          ],
          createBy: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          createDate: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updateBy: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updateDate: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          remarks: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/ybt-backend/generator/packsinfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.orgId = data.packsinfo.orgId
                this.dataForm.siteId = data.packsinfo.siteId
                this.dataForm.name = data.packsinfo.name
                this.dataForm.ratio = data.packsinfo.ratio
                this.dataForm.markPrice = data.packsinfo.markPrice
                this.dataForm.salePrice = data.packsinfo.salePrice
                this.dataForm.isMobile = data.packsinfo.isMobile
                this.dataForm.validStartDate = data.packsinfo.validStartDate
                this.dataForm.validEndDate = data.packsinfo.validEndDate
                this.dataForm.videoUrl = data.packsinfo.videoUrl
                this.dataForm.photoUrl = data.packsinfo.photoUrl
                this.dataForm.photoSelectUrl = data.packsinfo.photoSelectUrl
                this.dataForm.isOpenBranch = data.packsinfo.isOpenBranch
                this.dataForm.productSource = data.packsinfo.productSource
                this.dataForm.selectNum = data.packsinfo.selectNum
                this.dataForm.details = data.packsinfo.details
                this.dataForm.shareName = data.packsinfo.shareName
                this.dataForm.shareContent = data.packsinfo.shareContent
                this.dataForm.isShowPrice = data.packsinfo.isShowPrice
                this.dataForm.operStatus = data.packsinfo.operStatus
                this.dataForm.createBy = data.packsinfo.createBy
                this.dataForm.createDate = data.packsinfo.createDate
                this.dataForm.updateBy = data.packsinfo.updateBy
                this.dataForm.updateDate = data.packsinfo.updateDate
                this.dataForm.remarks = data.packsinfo.remarks
                this.dataForm.status = data.packsinfo.status
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/ybt-backend/generator/packsinfo/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'orgId': this.dataForm.orgId,
                'siteId': this.dataForm.siteId,
                'name': this.dataForm.name,
                'ratio': this.dataForm.ratio,
                'markPrice': this.dataForm.markPrice,
                'salePrice': this.dataForm.salePrice,
                'isMobile': this.dataForm.isMobile,
                'validStartDate': this.dataForm.validStartDate,
                'validEndDate': this.dataForm.validEndDate,
                'videoUrl': this.dataForm.videoUrl,
                'photoUrl': this.dataForm.photoUrl,
                'photoSelectUrl': this.dataForm.photoSelectUrl,
                'isOpenBranch': this.dataForm.isOpenBranch,
                'productSource': this.dataForm.productSource,
                'selectNum': this.dataForm.selectNum,
                'details': this.dataForm.details,
                'shareName': this.dataForm.shareName,
                'shareContent': this.dataForm.shareContent,
                'isShowPrice': this.dataForm.isShowPrice,
                'operStatus': this.dataForm.operStatus,
                'createBy': this.dataForm.createBy,
                'createDate': this.dataForm.createDate,
                'updateBy': this.dataForm.updateBy,
                'updateDate': this.dataForm.updateDate,
                'remarks': this.dataForm.remarks,
                'status': this.dataForm.status
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
