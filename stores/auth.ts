import { skipHydrate } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useAuthStore = defineStore('authStore', () => {
  const tokenKey = 'token'
  const tokenDefault = ''

  const jwtToken = computed(() => {
    const sessionJwtToken = useSessionStorage(tokenKey, tokenDefault, {
      writeDefaults: false,
    })
    const localJwtToken = useLocalStorage(tokenKey, tokenDefault, {
      writeDefaults: false,
    })

    if (sessionJwtToken.value.length > 0) return sessionJwtToken.value
    else return localJwtToken.value
  })
  const isLoggedIn = computed(() => jwtToken.value.length > 0)

  function setJwtToken(token: string, isLocalStorage = false) {
    const state = useStorage(
      tokenKey,
      tokenDefault,
      isLocalStorage ? localStorage : sessionStorage
    )
    state.value = token
  }

  function clear() {
    useSessionStorage(tokenKey, tokenDefault).value = null
    useLocalStorage(tokenKey, tokenDefault).value = null
  }

  return {
    /** readonly ref
     * set jwt tokenvia `setJwtToken` function
     */
    jwtToken,
    setJwtToken,
    isLoggedIn,
    clear,
  }
})
