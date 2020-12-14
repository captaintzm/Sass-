/**
 * Created by Administrator on 2019/4/1.
 */

function getFormData (obj = {}) { // 参数序列化
  let formData = new FormData()
  Object.keys(obj).forEach(key => {
    formData.append(key, obj[key])
  })
  return formData
}

export default {
  getFormData
}
