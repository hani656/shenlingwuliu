<script setup>
  import { ref } from 'vue'
  import { useTaskStore } from '@/stores/task'
  const taskStore = useTaskStore()

  // 在自定义组件时接收外部传入的数据
  const props = defineProps({
    types: Array,
    dataKey: String,
  })

  // 记当前选中的选项的索引值
  const tabIndex = ref(-1)
  function onOptionSelect(index, id, text) {
    tabIndex.value = index
    taskStore.recordData[props.dataKey] = id

    // console.log(text)
    // console.log(props.dataKey)
  }
</script>
<template>
  <view class="vehicle-options">
    <view
      v-for="(option, index) in props.types"
      :key="option.id"
      @click="onOptionSelect(index, option.id, option.text)"
      :class="{ active: index === tabIndex }"
      class="option"
    >
      {{ option.text }}
    </view>
  </view>
</template>

<style lang="scss" scoped>
  .vehicle-options {
    display: flex;
    flex-wrap: wrap;
    font-size: $uni-font-size-small;

    .option {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 180rpx;
      height: 70rpx;
      padding-top: 1rpx;
      margin-top: 30rpx;
      margin-right: 38rpx;
      color: $uni-secondary-color;
      border: 2rpx solid $uni-bg-color;
      background-color: $uni-bg-color;
      border-radius: 20rpx;

      &:nth-child(3n) {
        margin-right: 0;
      }

      &.active {
        color: $uni-primary;
        border: 2rpx solid $uni-primary;
        background-color: #ffe0dd;
      }
    }
  }
</style>
