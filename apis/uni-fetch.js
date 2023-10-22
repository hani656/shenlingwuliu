// 导入安装好的 uni-app-fetch 模块
import { createUniFetch } from 'uni-app-fetch'
// 导入与用户相关的 store
import { useUserStore } from '@/stores/user'

// 将当前项目所有 tabBar 页面列出来
const tabBarPagePaths = [
  'pages/task/index',
  'pages/message/index',
  'pages/my/index'
]

// 配置符合自身业务的请求对象
export const uniFetch = createUniFetch({
  loading: { title: '正在加载...' },
  baseURL: 'https://slwl-api.itheima.net',
  intercept: {
    // 请求拦截器
    request(options) {
      // 获取 store 中的数据
      const userStore = useUserStore()

      // 自定义头信息，来传递 token 数据
      const defautHeader = {
        Authorization: userStore.token,
      }

      // 将定义好的头信息与请求本身的头信息options.header来合并
      options.header = Object.assign({}, defautHeader, options.header)

      return options
    },
    // 响应拦截器
    response({ statusCode, data }) {

      // 判断响应结果的状态码是不是 401 如果是表明用户未登录功登录失效
      // 此时需要引导用户完成登录
      if (statusCode === 401) {

        // 获取当前位于哪个页面？？
        // 通过 getCurrentPages() 获取！！！
        // 即页面栈数组的最后一个单元
        const pageStack = getCurrentPages()
        const currentPage = pageStack[pageStack.length - 1]
        // 页面路径
        const redirectURL = currentPage.route

        // 判断数组中是否包含某个单元
        const routeType = tabBarPagePaths.includes(redirectURL) ? 'switchTab' : 'redirectTo'

        // 跳转到登录页(需要在地址上拼凑参数，即回跳地址)
        uni.redirectTo({
          url: `/pages/login/index?redirectURL=/${redirectURL}&routeType=${routeType}`
        })
      }

      // 将返回数据中多余部分过滤掉
      return data
    },
  },
})