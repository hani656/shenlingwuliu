<script setup>
  import { ref, computed, reactive } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import taskApi from '@/apis/task'

  // 组件 ref
  const popup = ref(null)
  // 异常日期
  const timePicker = ref('')

  // 定义 popup 组件展示的数据
  const exceptionTypes = reactive([
    { text: '发动机启动困难', checked: true },
    { text: '不着车，漏油', checked: false },
    { text: '照明失灵', checked: false },
    { text: '排烟异常、温度异常', checked: false },
    { text: '其他问题', checked: false },
  ])

  // 运输id
  const transportTaskId = ref('')
  // 异常时间
  const exceptionTime = computed(() => {
    return timePicker.value || '请选择'
  })
  // 异常位置
  const exceptionPlace = ref('')
  // 异常描述
  const exceptionDescribe = ref('')
  // 货品图片
  const goodsPictrues = ref([])
  // 数据二次处理，只保留 url 属性
  const exceptionImagesList = computed(() => {
    return goodsPictrues.value.map(({ url }) => {
      return { url }
    })
  })
  // 异常的类型
  const exceptionType = ref('')

  // 打开地图
  async function onLocationChoose() {
    try {
      const { address } = await uni.chooseLocation()
      // 获取当前位置
      exceptionPlace.value = address
    } catch (err) {
      console.log(err)
    }
  }

  // 临时记录异常类型选项（可以不必是响应式）
  let tempException = []
  // 监听用户选择类型
  function onCheckboxChange(index) {
    // 切换选中状态
    exceptionTypes[index].checked = !exceptionTypes[index].checked
  }

  // 获取地址参数
  onLoad((query) => {
    // 运输ID
    transportTaskId.value = query.transportTaskId
  })

  async function onFormSubmit() {
    // 表单数据
    const formData = {
      transportTaskId: transportTaskId.value,
      exceptionTime: exceptionTime.value,
      exceptionPlace: exceptionPlace.value,
      exceptionType: exceptionType.value,
      exceptionDescribe: exceptionDescribe.value,
      exceptionImagesList: exceptionImagesList.value,
    }

    const { code } = await taskApi.except(formData)
    if (code !== 200) return uni.utils.toast('上报异常失败!')
    uni.reLaunch({ url: '/pages/task/index' })
  }

  // 打开弹层
  function onPopupOpen() {
    popup.value.open()
  }

  // 关闭弹层
  function onPopupClose() {
    popup.value.close()

    // 获取用户选择的类型并回显到页面，即将 checked 属性为 true 单元取出
    tempException = exceptionTypes.filter((type) => {
      return type.checked
    })

    // 将选择的类型用 | 拼接并回显
    exceptionType.value = tempException
      .map((type) => {
        return type.text
      })
      .join('|')
  }
</script>

<template>
  <view class="page-container">
    <scroll-view class="scroll-view" scroll-y>
      <view class="scroll-view-wrapper">
        <uni-list :border="false">
          <uni-list-item show-arrow title="异常时间">
            <template v-slot:footer>
              <uni-datetime-picker v-model="timePicker">
                <view class="picker-value">{{ exceptionTime }}</view>
              </uni-datetime-picker>
            </template>
          </uni-list-item>
          <uni-list-item
            show-arrow
            clickable
            ellipsis="1"
            @click="onLocationChoose"
            title="上报位置"
            :right-text="exceptionPlace || '请选择'"
          />
          <uni-list-item
            show-arrow
            clickable
            @click="onPopupOpen"
            title="异常类型"
            :right-text="exceptionType || '请选择'"
          />
          <uni-list-item direction="column" title="异常描述">
            <template v-slot:footer>
              <view class="textarea-wrapper">
                <textarea
                  v-model="exceptionDescribe"
                  class="textarea"
                  placeholder="请输入异常描述"
                ></textarea>
                <view class="words-count">0/50</view>
              </view>
            </template>
          </uni-list-item>
        </uni-list>
        <uni-list class="upload-picture">
          <uni-list-item direction="column" title="上传图片（最多6张）">
            <template v-slot:footer>
              <uni-file-picker
                v-model="goodsPictrues"
                file-extname="jpg,webp,gif,png"
                limit="3"
              ></uni-file-picker>
            </template>
          </uni-list-item>
        </uni-list>
      </view>
    </scroll-view>
    <view class="fixbar">
      <button @click="onFormSubmit" class="button disable">提交</button>
    </view>

    <uni-popup ref="popup" type="bottom">
      <uni-list class="popup-action-sheet">
        <uni-list-item>
          <template v-slot:header>
            <view style="margin-top: 4rpx; font-size: 32rpx; font-weight: 700"
              >选择类型</view
            >
          </template>
          <template v-slot:footer>
            <uni-icons
              @click="onPopupClose"
              type="closeempty"
              size="20"
            ></uni-icons>
          </template>
        </uni-list-item>

        <uni-list-item
          v-for="(exceptionType, index) in exceptionTypes"
          :key="exceptionType.text"
          :title="exceptionType.text"
        >
          <template v-slot:footer>
            <checkbox-group @change="onCheckboxChange(index)" class="checkbox">
              <checkbox :checked="exceptionType.checked" color="#EF4F3F" />
            </checkbox-group>
          </template>
        </uni-list-item>

        <uni-list-item>
          <template v-slot:body>
            <button @click="onPopupClose" class="button">确定</button>
          </template>
        </uni-list-item>
      </uni-list>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
