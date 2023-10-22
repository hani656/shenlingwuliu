<script setup>
  // 引入 ref 或 reactive
  import { ref, reactive } from 'vue'
  // 获取生命周期
  import { onLoad } from '@dcloudio/uni-app'

  import userApi from '@/apis/user'
  // 导入状态数据
  import { useUserStore } from '@/stores/user'

  // 调用 useUserStore 来读取 store 中的数据
  const userStore = useUserStore()

  // 定义获取表单元素的变量
  const accountForm = ref()

  // 待跳转的页面路径
  const redirectURL = ref('')
  // 页面跳转方式
  const routeType = ref('')

  // 定义表单中的数据
  const formData = reactive({
    account: 'shenling',
    password: '123456',
  })

  // 定义验证规则
  const accountRules = reactive({
    account: {
      rules: [
        { required: true, errorMessage: '请输入登录账号' },
        { pattern: '^[a-zA-Z0-9]{6,8}$', errorMessage: '登录账号格式不正确' },
      ],
    },
    password: {
      rules: [
        { required: true, errorMessage: '请输入登录密码' },
        { pattern: '^\\d{6}$', errorMessage: '登录密码格式不正确' },
      ],
    },
  })

  // 获取地址中的参数
  onLoad((query) => {
    redirectURL.value = query.redirectURL
    routeType.value = query.routeType
  })

  // 提交表单数据
  async function onSubmitForm() {
    // 对表单的数据进行验证
    try {
      // 当验证成功后所返回的数据为 表单中的数据，这些数据用于表单提交
      const formData = await accountForm.value.validate()

      // 调用接口
      const { code, data } = await userApi.login(formData)

      // 在 Pinia 中允许直接对数据(state)进行修改
      userStore.token = data

      console.log(routeType.value)

      // 当登成功后需要跳转到原来的页面
      uni[routeType.value]({ url: redirectURL.value })

      // 验证失败会提示失败的原因
    } catch (err) {
      console.log(err)
    }
  }
</script>

<template>
  <uni-forms
    class="login-form"
    :rules="accountRules"
    ref="accountForm"
    :model="formData"
  >
    <uni-forms-item name="account">
      <input
        type="text"
        v-model="formData.account"
        placeholder="请输入账号"
        class="uni-input-input"
        placeholder-style="color: #818181"
      />
    </uni-forms-item>
    <uni-forms-item name="password">
      <input
        type="text"
        v-model="formData.password"
        placeholder="请输入密码"
        class="uni-input-input"
        placeholder-style="color: #818181"
      />
    </uni-forms-item>
    <button @click="onSubmitForm" class="submit-button">登录</button>
  </uni-forms>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
