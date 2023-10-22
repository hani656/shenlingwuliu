<script setup>
  import { ref, computed } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import taskApi from '@/apis/task'

  // 原定提货时间
  const planDepartureTime = ref('')
  // 任务的ID
  const id = ref('')

  // 延迟时间
  const delayTime = ref('')
  // 验证延迟时间不能超过两个小时
  const delayTimeValid = computed(() => {
    // 验证数据是否合法（不能超过2小时 7200 * 1000）
    const start = new Date(planDepartureTime.value)
    const end = new Date(delayTime.value)
    return end - start > 0 && end - start <= 7200 * 1000
  })
  // 延迟原因
  const delayReason = ref('')
  // 统计字数
  const wordsCount = computed(() => {
    return delayReason.value.length
  })

  // 验证延迟原因
  const delayReasonValid = computed(() => {
    return wordsCount.value <= 50 && wordsCount.value > 0
  })

  // 是否允许表单提交
  const enableSubmit = computed(() => {
    return delayReasonValid.value && delayTimeValid.value
  })

  onLoad((query) => {
    // console.log(query)
    planDepartureTime.value = query.planDepartureTime
    id.value = query.id
  })

  // 获取用户选择的时间
  function onPickerChange(ev) {
    // 延迟时间必定与原定时间处在同一天
    const [date] = planDepartureTime.value.split(' ')
    delayTime.value = `${date} ${ev.detail.value}`
  }

  // 提交延迟提货数据
  async function onFormSubmit() {
    const fromData = {
      id: id.value,
      delayTime: delayTime.value,
      delayReason: delayReason.value,
    }
    const { code } = await taskApi.delay(fromData)
    // 检测接口
    if (code !== 200) return uni.utils.toast('延迟申请失败！')
    // 跳转到任务列表
    uni.reLaunch({ url: '/pages/task/index' })
  }
</script>

<template>
  <view class="page-container">
    <uni-list :border="false">
      <uni-list-item
        title="原定时间 "
        showArrow
        :rightText="planDepartureTime"
      />
      <uni-list-item title="延迟时间" showArrow>
        <template v-slot:footer>
          <picker @change="onPickerChange" class="time-picker" mode="time">
            <text v-if="!delayTime">不可超过2个小时</text>
            <text :class="{ error: !delayTimeValid }" v-else>
              {{ delayTime }}:00
            </text>
          </picker>
        </template>
      </uni-list-item>
      <uni-list-item direction="column">
        <template v-slot:body>
          <view class="textarea-wrapper">
            <textarea
              v-model="delayReason"
              class="textarea"
              placeholder-style="color: #818181"
              placeholder="请输入延迟提货原因"
            ></textarea>
            <text :class="{ error: wordsCount > 50 }" class="words-count">
              {{ wordsCount }}/50
            </text>
          </view>
        </template>
      </uni-list-item>
      <uni-list-item :border="false">
        <template v-slot:body>
          <button
            @click="onFormSubmit"
            :disabled="!enableSubmit"
            class="button"
          >
            提交
          </button>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
