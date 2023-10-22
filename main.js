import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import App from './App'

// 在入口中执行 utils/utils.js
import './utils/utils'

export function createApp() {
  const app = createSSRApp(App)

  const pinia = createPinia()
  // 插件默认的配置
  // pinia.use(piniaPluginPersistedstate)

  // 自定义 pinia 插件实例
  pinia.use(
    createPersistedState({
      key: (id) => `__persisted__${id}`,
      storage: {
        setItem(key, value) {
          // 定义如何存数据
          uni.setStorageSync(key, value)
        },
        getItem(key) {
          // 定义如何取数据
          return uni.getStorageSync(key)
        }
      },
    })
  )

  app.use(pinia)

  return {
    app,
  }
}