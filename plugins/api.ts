export default defineNuxtPlugin({
  setup() {
    const authorizedApi = $fetch.create({
      baseURL: useRuntimeConfig().public.apiBase,
      onRequest({ request, options }) {
        const authStore = useAuthStore()
        const { isLoggedIn, jwtToken } = storeToRefs(authStore)

        if (isLoggedIn.value) {
          options.headers = options.headers || {}
          // @ts-ignore
          options.headers.authorization = `Bearer ${jwtToken.value}`
        }
      },
    })

    return {
      provide: {
        authorizedApi,
      },
    }
  },
})
