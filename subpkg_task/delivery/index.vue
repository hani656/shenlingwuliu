<script setup>
  import { ref, computed } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import taskApi from '@/apis/task'

  // 定义数据获取上传的图片
  const receiptPictures = ref([])
  const goodsPictures = ref([])

  // 运输任务id
  const id = ref('')
  // 处理接口所需要的数据（只保留 url 属性）
  const certificatePictureList = computed(() => {
    return receiptPictures.value.map(({ url }) => {
      return { url }
    })
  })
  const deliverPictureList = computed(() => {
    return goodsPictures.value.map(({ url }) => {
      return { url }
    })
  })

  // 是否允许提交数据
  const enableSubmit = computed(() => {
    return receiptPictures.value.length > 0 && goodsPictures.value.length > 0
  })

  onLoad((query) => {
    // 地址参数
    id.value = query.id
  })

  // 监听表单提交
  function onFormSubmit() {
    // 表单数据
    const formData = {
      id: id.value,
      deliverPictureList: deliverPictureList.value,
      certificatePictureList: certificatePictureList.value,
    }

    const { code } = taskApi.delivery(formData)
    if (code !== 200) return uni.utils.toast('交付失败!')
    uni.reLaunch({ url: '/pages/task/index' })
  }
</script>

<template>
  <view class="page-container">
    <view class="receipt-info">
      <uni-file-picker
        v-model="receiptPictures"
        limit="3"
        title="请拍照上传回单凭证"
      ></uni-file-picker>
      <uni-file-picker
        v-model="goodsPictures"
        limit="3"
        title="请拍照上传货品照片"
      ></uni-file-picker>
    </view>
    <button @click="onFormSubmit" :disabled="!enableSubmit" class="button">
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

    &[disabled] {
      color: #fff;
      background-color: #fadcd9;
    }
  }
</style>
