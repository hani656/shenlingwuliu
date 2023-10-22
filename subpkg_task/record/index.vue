<script setup>
  import { ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import { storeToRefs } from 'pinia'
  import { useTaskStore } from '@/stores/task'
  import taskApi from '@/apis/task'

  import slVehicleViolation from './components/vehicle-violation'
  import slVehicleBreakdown from './components/vehicle-breakdown'
  import slVehicleAccident from './components/vehicle-accident'

  // 回车登记的全部数据
  const { recordData } = storeToRefs(useTaskStore())

  // 运输ID
  // const id = ref('')
  // 出车时间
  const startTime = ref('')
  // 回车时间
  const endTime = ref('')

  // 获取地址参数
  onLoad((query) => {
    // 出车时间
    recordData.value.startTime = query.actualDepartureTime
    recordData.value.id = query.transportTaskId
  })

  // 监听表单提交
  async function onFormSubmit() {
    // 提交数据
    const { code } = await taskApi.record(recordData.value)
    if (code !== 200) return uni.utils.toast('回车登记失败')
    uni.reLaunch({ url: '/pages/task/index' })
  }
</script>
<template>
  <view class="page-container">
    <scroll-view class="scroll-view" scroll-y>
      <view class="scroll-view-wrapper">
        <uni-list class="base-info">
          <uni-list-item
            title="出车时间"
            show-arrow
            :right-text="recordData.startTime"
          />
          <uni-list-item show-arrow title="回车时间">
            <template v-slot:footer>
              <uni-datetime-picker v-model="recordData.endTime">
                <view class="picker-value">{{
                  recordData.endTime || '请选择'
                }}</view>
              </uni-datetime-picker>
            </template>
          </uni-list-item>
        </uni-list>
        <sl-vehicle-violation></sl-vehicle-violation>
        <sl-vehicle-breakdown></sl-vehicle-breakdown>
        <sl-vehicle-accident></sl-vehicle-accident>
      </view>
    </scroll-view>
    <view class="toolbar">
      <button @click="onFormSubmit" class="button">提交登记</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
