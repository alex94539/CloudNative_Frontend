<script setup lang="ts">
const username = ref('')
const password = ref('')
const rememberMe = ref(true)

const isLoading = ref(false)
const shouldShowErrMsg = ref(false)

const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore()

const emits = defineEmits<{
  loginSuccess: [token: string]
}>()
interface LoginApiResponse {
  token: string
}
// const {
//   data,
//   pending,
//   status,
//   error,
//   execute: doLogin,
//   clear,
// } = await useAsyncData(
//   () =>
//     $fetch('/authenticate/login', {
//       baseURL: runtimeConfig.public.apiBase,
//       method: 'POST',
//       body: {
//         username: username.value,
//         password: password.value,
//       },
//       onResponse({ response }) {
//         console.log(response)
//         isLoading.value = false
//       },
//     }),
//   { immediate: false }
// )

const {
  data: loginResponseData,
  execute: sendLoginApi,
  status: loginResponseStatus,
} = await useAsyncData<LoginApiResponse>(
  () =>
    $fetch('/authenticate/root', {
      baseURL: runtimeConfig.public.apiBase,
      onResponse({ response }) {
        console.log(response)
      },
    }),
  { immediate: false }
)

const isLoginSuccessful = computed(() => {
  return (
    loginResponseStatus.value === 'success' &&
    loginResponseData.value != null &&
    loginResponseData.value.token.length > 0
  )
})

watch(loginResponseStatus, (newValue) => {
  if (newValue === 'error') {
    shouldShowErrMsg.value = true
  }
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
      <Message v-show="isLoginSuccessful" :severity="'success'"
        >成功取得token: {{ loginResponseData?.token }}</Message
      >

      <div class="text-center">
        <InlineMessage :severity="'info'" class=""
          >測試中免帳密直接登入root帳號</InlineMessage
        >
      </div>

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

        <Button label="登入" :loading="isLoading" type="submit" />
      </form>
    </template>
  </Card>
</template>
