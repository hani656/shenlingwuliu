<script setup>
  import { ref, onMounted } from 'vue'
  import messageApi from '@/apis/message'

  // 任务通知列表
  const notifyList = ref([])
  // 当前列表是否为空
  const isEmpty = ref(false)

  // 定义页码来记录请求第几页数据
  const nextPage = ref(1)

  // 判断还有更多的数据，即下一页
  const hasMore = ref(true)

  // 是否加载完成
  const isTriggered = ref(false)

  // 组件中建议合使用 vue 的生命周期
  onMounted(() => {
    getNotifyList()
  })

  // 监听用户是否滚动到页面底部
  function onScrollToLower() {
    console.log('到底了...')
    // 如果没有更多数据，则不必发起请求
    if (!hasMore.value) return
    getNotifyList(nextPage.value)
  }

  // 监听用户的下拉操作
  async function onScrollViewRefresh() {
    isTriggered.value = true
    // 必须要在请求结束后才结束下拉的动画
    await getNotifyList()
    isTriggered.value = false
  }

  // 获取任务通知
  async function getNotifyList(page = 1, pageSize = 5) {
    const { code, data } = await messageApi.list(201, page, pageSize)
    // 检测接口中是否调用成功
    if (code !== 200) return uni.utils.toast('获取列表失败!')
    // 如果请求的是第1页那么将 notifyList 置成空数组
    if (page === 1) notifyList.value = []
    // 渲染数据
    notifyList.value = [...notifyList.value, ...data.items]
    // 判断是否为空数组
    isEmpty.value = notifyList.value.length === 0
    // 计算下一页的页码
    nextPage.value = ++data.page
    // 如果 nextPage 小于等于 data.pages 时表时还有下一页
    hasMore.value = nextPage.value <= data.pages
  }

  async function readAll() {
    // const { code } = await messageApi.readAll(201)
    // //
    // if (code === 200) {
    //   // 表明后端已经将数据状态变为已读
    // }

    notifyList.value.forEach((item) => {
      console.log(item.isRead)
      item.isRead = 1
    })
  }
</script>
<template>
  <scroll-view
    @scrolltolower="onScrollToLower"
    @refresherrefresh="onScrollViewRefresh"
    :refresher-triggered="isTriggered"
    class="scroll-view"
    refresher-enabled
    scroll-y
  >
    <view class="scroll-view-wrapper">
      <view @click="readAll" class="message-action">
        <text class="iconfont icon-clear"></text>
        全部已读
      </view>
      <uni-card
        v-for="notify in notifyList"
        :key="notify.id"
        :border="false"
        :is-shadow="false"
      >
        <view class="brief">{{ notify.content }}</view>
        <view class="extra">
          <text class="time">{{ notify.created }}</text>
          <navigator
            hover-class="none"
            class="link"
            :url="`/subpkg_task/detail/index?id=${notify.id}`"
          >
            查看详情
          </navigator>
        </view>
        <template v-slot:title>
          <view :class="{ unread: !notify.isRead }" class="title">
            您有新的运输任务
          </view>
        </template>
      </uni-card>
      <view v-if="isEmpty" class="message-blank">暂无消息</view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>