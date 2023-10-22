<script setup>
  import { storeToRefs } from 'pinia'
  import { useCounterStore } from '@/stores/counter'
  const store = useCounterStore()

  // 直接使用数据 (state) 本身
  const { count } = storeToRefs(store)

  // store 中的方法直接解构即可
  const { decrement, increment } = store

  // console.log(store.count)
</script>
<template>
  <view class="counter">
    <button class="button" @click="decrement" type="primary">-</button>
    <input class="input" :value="count" type="text" />
    <button class="button" @click="increment" type="primary">+</button>
  </view>
</template>

<style lang="scss" scoped>
  .counter {
    display: flex;
    padding: 100rpx;
  }

  .input {
    flex: 1;
    height: 96rpx;
    text-align: center;
    border: 2rpx solid #eee;
    box-sizing: border-box;
  }

  .button {
    width: 100rpx;
    margin: 0;

    &:first-child {
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }
    &:last-child {
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }
  }
</style>
