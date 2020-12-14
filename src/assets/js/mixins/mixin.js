/**
 * Created by Administrator on 2020/7/15.
 */
export const globalMethods = {
  data () {
    return {

    }
  },
  methods: {
    checkLink (url, query) {
      var newQuery = []
      for (var k in query) {
        newQuery.push(`${k}=${query[k]}`)
      }
      return `${location.origin}${url}?${newQuery.join('&')}`
    },
    // 导出excel
    exportExcel (api, data) {
      this.$http[api](data).then((res) => {
        const contentDispositions = res.headers['content-disposition'].split(';')
        contentDispositions.forEach((item, index) => {
          contentDispositions[index] = item.split('=')
        })
        const data = res.data
        const blob = new Blob([data])
        const fileName = `${decodeURI(contentDispositions[1][1])}.xls`
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
        this.Message('导出成功')
      })
    },
    phoneRuel (rule, value, callback) { // 判断手机号是否正确
      var reg = /^1\d{10}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    },
    isNumber (rule, value, callback) { // 判断手机号是否正确
      var reg = /^\d+(\.\d+)?$/
      // var reg = /^\d+(\.\d+)$/
      if (!reg.test(value)) {
        callback(new Error('数值必须大于0'))
      } else {
        callback()
      }
    },
    isNum (rule, value, callback) { // 判断数值必须为整数
      var reg = /^-?[0-9]\d*$/
      if (!reg.test(value)) {
        callback(new Error('数值必须为整数'))
      } else {
        callback()
      }
    },
    isNum2 (rule, value, callback) { // 判断数值必须为整数
      var reg = /^\+?[1-9][0-9]*$/
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('请输入≥1的正整数'))
        } else {
          if (value < 1) {
            callback(new Error('请输入≥1的正整数'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    },
    smallNum (rule, value, callback, num) { // 判断数值必须为整数
      if (value < num) {
        callback(new Error('数值不能小于' + num))
      } else {
        callback()
      }
    },
    isnumberType (rule, value, callback, num) {
      if (value < num) {
        callback(new Error('数值不能小于' + num))
      } else {
        callback()
      }
    },
    verify (type, msg, num) {
      const verify = {
        required: {
          required: true,
          message: msg,
          trigger: 'blur'
        },
        requiredno: {
          required: false,
          message: msg,
          trigger: 'blur'
        },
        change: {
          required: true,
          message: msg,
          trigger: 'change'
        },
        phone: {
          validator: this.phoneRuel,
          trigger: 'blur'
        },
        number: {
          validator: this.isNumber,
          trigger: 'blur',
          message: msg
        },
        number2: {
          required: false,
          validator: this.isNum2,
          trigger: 'blur',
          message: msg
        },
        smallNum: {
          validator: (rule, value, callback) => this.smallNum(rule, value, callback, num),
          trigger: 'blur',
          message: msg
        },
        isNum: {
          validator: this.isNum,
          trigger: 'blur',
          message: msg
        },
        numberType: {
          validator: this.isnumberType,
          trigger: 'blur',
          message: msg
        }
      }
      return verify[type]
    }
  }
}
