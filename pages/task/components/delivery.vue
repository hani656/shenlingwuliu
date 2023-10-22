<script setup>
  import { ref, onMounted } from 'vue'
  import taskApi from '@/apis/task'

  // 定义数据
  const deliveryList = ref([])
  // 是否加载完成
  const isTriggered = ref(false)

  // 判断在途列表是否为空
  const isEmpty = ref(false)

  // 请求数据
  onMounted(() => {
    getDeliveryList()
  })

  // 获取在途列表数据
  async function getDeliveryList() {
    const { code, data } = await taskApi.list(2)
    // 检测接口是否调用成功
    if (code !== 200) return uni.utils.toast('在途列表获取失败!')
    // 数据渲染
    deliveryList.value = data.items
    // 是否为空列表
    isEmpty.value = deliveryList.value.length > 0
  }

  // 监听用户的下拉操作
  async function onScrollViewRefresh() {
    isTriggered.value = true
    // 必须要在请求结束后才结束下拉的动画
    await getDeliveryList()
    // 关闭动画交互
    isTriggered.value = false
  }
</script>
<template>
  <scroll-view
    @refresherrefresh="onScrollViewRefresh"
    :refresher-triggered="isTriggered"
    scroll-y
    refresher-enabled
    class="scroll-view"
  >
    <view class="scroll-view-wrapper">
      <view
        v-for="delivery in deliveryList"
        :key="delivery.id"
        class="task-card"
      >
        <navigator
          hover-class="none"
          :url="`/subpkg_task/detail/index?id=${delivery.id}`"
        >
          <view class="header">
            <text class="no">任务编号: {{ delivery.transportTaskId }}</text>
          </view>
          <view class="body">
            <view class="timeline">
              <view class="line">{{ delivery.startAddress }}</view>
              <view class="line">{{ delivery.endAddress }}</view>
            </view>
          </view>
        </navigator>
        <view class="footer">
          <view class="label">提货时间</view>
          <view class="time">{{ delivery.created }}</view>
          <!-- statues 为 2 交付 -->
          <navigator
            v-if="delivery.status === 2"
            hover-class="none"
            :url="`/subpkg_task/delivery/index?id=${delivery.id}`"
            class="action"
          >
            交付
          </navigator>
          <!-- status 为 4 时回车登记 -->
          <navigator
            v-if="delivery.status === 4"
            hover-class="none"
            :url="`/subpkg_task/record/index?transportTaskId=${delivery.transportTaskId}&actualDepartureTime=${delivery.actualDepartureTime}`"
            class="action"
          >
            回车登记
          </navigator>
        </view>
      </view>
      <view v-if="!isEmpty" class="task-blank">无在途货物</view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
