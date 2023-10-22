<script setup>
  import { ref, onMounted } from 'vue'
  import messageApi from '@/apis/message'

  // 公告列表数据
  const announceList = ref([])

  // 页面加载后请求数据
  onMounted(() => {
    getAnnounceList()
  })

  // 获取公告的数据
  async function getAnnounceList(page = 1, pageSize = 5) {
    const { code, data } = await messageApi.list(200, page, pageSize)
    if (code !== 200) return uni.utils.toast('数据获取失败！')
    // 数据渲染
    announceList.value = data.items
  }
</script>
<template>
  <scroll-view class="scroll-view" refresher-enabled scroll-y>
    <view class="scroll-view-wrapper">
      <view class="message-action">
        <text class="iconfont icon-clear"></text>
        全部已读
      </view>
      <uni-list :border="false">
        <uni-list-item
          v-for="announce in announceList"
          :key="announce.id"
          to="/subpkg_message/content/index"
          ellipsis="1"
          :title="announce.title"
          :right-text="announce.created"
        >
          <template v-slot:header>
            <text v-if="!announce.isRead" class="dot"></text>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
