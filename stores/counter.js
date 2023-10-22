import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // 响应式的数据（state）
  const count = ref(0)

  // 定义方法（相当于 actions）
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  // 目的是要外部能访问 count 这个响应式数据
  return { count, increment, decrement }
}, {
  persist: {
    paths: ['count']
  },
})