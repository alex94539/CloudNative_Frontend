<script setup lang="ts">
const username = ref('')
const password = ref('')
const rememberMe = ref(true)
const isLoginDisabled = computed(() => {
  return username.value.length == 0 && password.value.length == 0
})
const isLoading = ref(false)
const shouldShowErrMsg = ref(false)

const runtimeConfig = useRuntimeConfig()

const emits = defineEmits<{
  loginSuccess: [token: string]
}>()
interface LoginApiResponse {
  token: string
}
const apiLogin = await useFetch<LoginApiResponse>('/authenticate/login', {
  baseURL: runtimeConfig.public.apiBase,
  server: false,
  immediate: false,
  method: 'POST',
  body: {
    username: username,
    password: password,
  },
  watch: false,
  onResponse() {
    isLoading.value = false
  },
  onResponseError() {
    shouldShowErrMsg.value = true
  },
})

const {
  data: loginResponseData,
  execute: sendLoginApi,
  status: loginResponseStatus,
} = apiLogin

const isLoginSuccessful = computed(() => {
  return (
    loginResponseStatus.value === 'success' &&
    loginResponseData.value != null &&
    loginResponseData.value.token.length > 0
  )
})

watch(isLoginSuccessful, (status) => {
  if (status && loginResponseData.value) {
    loginHelper.login(loginResponseData.value.token, rememberMe.value)
    emits('loginSuccess', loginResponseData.value.token)
  }
})

const doLogin = () => {
  isLoading.value = true

  sendLoginApi()
}
</script>

<template>
  <Card class="w-[32rem]">
    <template #title>登入</template>
    <template #content>
      <Message v-show="shouldShowErrMsg" :severity="'error'"
        >帳號或密碼不正確</Message
      >

      <form class="flex flex-col gap-y-8" @submit.prevent="doLogin">
        <div class="flex flex-col gap-y-2">
          <label for="username">帳號</label>
          <InputText id="username" v-model="username" />
        </div>

        <div class="flex flex-col gap-y-2">
          <label for="password">密碼</label>
          <Password
            v-model="password"
            input-id="password"
            input-class="w-full"
            :feedback="false"
          />
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="rememberme" v-model="rememberMe" :binary="true" />
          <label for="rememberme">記住我</label>
        </div>

        <Button
          label="登入"
          :loading="isLoading"
          :disabled="isLoginDisabled"
          type="submit"
        />
      </form>
    </template>
  </Card>
</template>
