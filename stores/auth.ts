import { skipHydrate } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useAuthStore = defineStore('authStore', () => {
  const tokenKey = 'token'
  const tokenDefault = ''
  const _sessionJwtToken = useSessionStorage(tokenKey, tokenDefault, {
    writeDefaults: false,
  })
  const _localJwtToken = useLocalStorage(tokenKey, tokenDefault, {
    writeDefaults: false,
  })

  const jwtToken = computed(() => {
    if (_sessionJwtToken.value.length > 0)
      return _sessionJwtToken.value
    else
      return _localJwtToken.value
  })
  const isLoggedIn = computed(() => jwtToken.value.length > 0)

  function setJwtToken(token: string, isLocalStorage = false) {
    const state = isLocalStorage ? (_localJwtToken) : (_sessionJwtToken)
    state.value = token
  }

  function clear() {
    _sessionJwtToken.value = null
    _localJwtToken.value = null
  }

  return {
    /** readonly ref
     * set jwt tokenvia `setJwtToken` function
     */
    _sessionJwtToken: skipHydrate(_sessionJwtToken),
    _localJwtToken: skipHydrate(_localJwtToken),
    jwtToken,
    setJwtToken,
    isLoggedIn,
    clear,
  }
})
