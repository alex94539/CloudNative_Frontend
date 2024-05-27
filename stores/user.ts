import { skipHydrate } from 'pinia'

export const useUserIdentityStore = defineStore('userIdentityStore', () => {
  const _localStorageToken = useLocalStorage('token', '')

  const jwtToken = computed(() => _localStorageToken.value)
  const isLoggedIn = ref(false)

  function setJwtToken(token: string) {
    _localStorageToken.value = token
    isLoggedIn.value = true
  }

  return { _localStorageToken, jwtToken, setJwtToken, isLoggedIn }
})
