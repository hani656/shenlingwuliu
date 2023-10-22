import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 定义一个数据 token 用来记录用户登录状态
  const token = ref('')

  // 定义的数据必须要 return 
  return { token }
}, {
  persist: {
    paths: ['token']
  },
})