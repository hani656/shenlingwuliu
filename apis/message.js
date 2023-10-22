// 引入网络请求的封装
import { uniFetch } from './uni-fetch'

// export const xxx = () => {}

export default {
  /**
   * 消息列表
   * @property {string} contentType - 消息类型
   * @property {string} page - 消息数据对应的页码
   * @property {string} pageSize - 每页包含消息数据的条数
   */
  list(contentType, page = 1, pageSize = 10) {
    return uniFetch.get('/driver/messages/page', {
      contentType,
      page,
      pageSize,
    })
  },

  readAll(contentType) {
    uniFetch.put(`/driver/messages/readAll/${contentType}`)
  },
}
