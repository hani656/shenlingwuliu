// 引入 uni-fetch 来发起请求
import { uniFetch } from './uni-fetch.js'

// export const xxx = () => {}

// export default {
//   xxx: () => {}
// }

export default {
  /**
   * @param {Object} data - 登录所需要的用户名称密码
   */
  login(data) {
    if (!data.account || !data.password) return
    return uniFetch.post('/driver/login/account', data)
  },

  /**
   * 用户个人信息
   */
  profile() {
    return uniFetch.get('/driver/users')
  }
}