<script setup>
  import { ref, onMounted } from 'vue'
  import taskApi from '@/apis/task'

  // 待提货任务列表
  const pickupList = ref([])
  // 是否加载完成
  const isTriggered = ref(false)

  const nextPage = ref(1)

  // 判断还有没有更多数据，即下一页
  const hasMore = ref(true)

  // 判断提货列表是否为空
  const isEmpty = ref(false)

  onMounted(() => {
    getPickupList()
  })

  // 监听用户是否滚动到页面底部
  function onScrollToLower() {
    // console.log('到底了...')
    // 如果没有更多数据，则不必发起请求
    if (!hasMore.value) return uni.utils.toast('没有更多数据了！')
    getPickupList(nextPage.value)
  }

  // 获取待提货的列表
  async function getPickupList(page = 1, pageSize = 5) {
    const { code, data } = await taskApi.list(1, page, pageSize)
    if (code !== 200) return uni.utils.toast('获取列表失败!')
    // 如果请求的是第一页那么将 getPickupList 置成空数组
    if (page === 1) pickupList.value = []
    // 数据渲染
    pickupList.value = [...pickupList.value, ...data.items]
    // 是否为空列表
    isEmpty.value = pickupList.value.length > 0
    // 计算下一页的页码
    nextPage.value = ++data.page

    // 如果 nextPage 小于等于 data.pages 时表示还有下一页
    hasMore.value = nextPage.value <= data.pages
  }

  // 监听用户的下拉操作
  async function onScrollViewRefresh() {
    isTriggered.value = true
    // 必须要在请求结束后才结束下拉的动画
    await getPickupList()
    // 关闭动画交互
    isTriggered.value = false
  }
</script>

<template>
  <scroll-view
    @scrolltolower="onScrollToLower"
    @refresherrefresh="onScrollViewRefresh"
    :refresher-triggered="isTriggered"
    scroll-y
    refresher-enabled
    class="scroll-view"
  >
    <view class="scroll-view-wrapper">
      <view v-for="pickup in pickupList" :key="pickup.id" class="task-card">
        <navigator
          hover-class="none"
          :url="`/subpkg_task/detail/index?id=${pickup.id}`"
        >
          <view class="header">
            <text class="no">任务编号: {{ pickup.transportTaskId }}</text>
            <!-- <text class="status">已延迟</text> -->
          </view>
          <view class="body">
            <view class="timeline">
              <view class="line">{{ pickup.startAddress }}</view>
              <view class="line">{{ pickup.endAddress }}</view>
            </view>
          </view>
        </navigator>
        <view class="footer">
          <view class="label">提货时间</view>
          <view class="time">{{ pickup.planDepartureTime }}</view>
          <navigator
            v-if="pickup.enablePickUp"
            hover-class="none"
            :url="`/subpkg_task/pickup/index?id=${pickup.id}`"
            class="action"
          >
            提货
          </navigator>
          <text v-else disabled class="action"> 提货 </text>
        </view>
      </view>
      <view v-if="!isEmpty" class="task-blank">无待提货物</view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
