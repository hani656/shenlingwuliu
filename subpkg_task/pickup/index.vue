<script setup>
  import { ref, computed } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import taskApi from '@/apis/task'

  // 任务的id
  const id = ref('')

  // const testPicture = ref([])
  // 提货凭证图片
  const receiptPictures = ref([])
  // 将多余的数据过滤掉，只保留 url 后端接口要求的
  const cargoPickUpPictureList = computed(() => {
    return receiptPictures.value.map(({ url }) => {
      return { url }
    })
  })

  // 货品图片
  const goodsPictures = ref([])
  // 将多余的数据过滤掉，只保留 url 后端接口要求的
  const cargoPictureList = computed(() => {
    return goodsPictures.value.map(({ url }) => {
      return { url }
    })
  })

  // 是否允许提交数据
  const enableSubmit = computed(() => {
    return receiptPictures.value.length > 0 && goodsPictures.value.length > 0
  })

  // 获取地址参数
  onLoad((query) => {
    id.value = query.id
  })

  // 监听用户提交表单
  async function onSubmitForm() {
    // 表单数据的数据
    const formData = {
      id: id.value,
      cargoPictureList: cargoPictureList.value,
      cargoPickUpPictureList: cargoPickUpPictureList.value,
    }
    const { code } = await taskApi.pickup(formData)
    if (code !== 200) uni.utils.toast('提货失败!')
    uni.reLaunch({ url: '/pages/task/index' })
  }
</script>
<template>
  <view class="page-container">
    <view class="receipt-info">
      <uni-file-picker
        v-model="receiptPictures"
        limit="3"
        file-extname="png,jpg,webp,gif"
        title="请拍照上传回单凭证"
      ></uni-file-picker>
      <uni-file-picker
        v-model="goodsPictures"
        limit="3"
        file-extname="png,jpg,webp,gif"
        title="请拍照上传货品照片"
      ></uni-file-picker>
    </view>
    <button @click="onSubmitForm" :disabled="!enableSubmit" class="button">
      提交
    </button>
  </view>
</template>

<style lang="scss" scoped>
  .page-container {
    padding: 30rpx;
  }

  .receipt-info {
    min-height: 600rpx;
    background-color: #fff;
    padding: 20rpx 30rpx;
    border-radius: 16rpx;

    ::v-deep .uni-file-picker {
      margin-bottom: 30rpx;
    }
  }

  .button {
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    /* #ifdef APP */
    padding-top: 4rpx;
    /* #endif */
    border-radius: 100rpx;
    margin-top: 60rpx;
    color: #fff;
    font-size: $uni-font-size-big;
    background-color: $uni-primary;

    &[disabled],
    &.disabled {
      color: #fff;
      background-color: #fadcd9;
    }
  }
</style>
