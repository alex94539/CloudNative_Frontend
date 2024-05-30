import { skipHydrate } from 'pinia'

type userRole = 'Admin' | 'User'
interface JwtPayload {
  role: userRole
  username: string
  _id: string
  iat: number
  exp: number
}

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
    if (_sessionJwtToken.value !== null && _sessionJwtToken.value.length > 0) {
      return _sessionJwtToken.value
    } else if (
      _localJwtToken.value !== null &&
      _localJwtToken.value.length > 0
    ) {
      return _localJwtToken.value
    } else return ''
  })
  const isLoggedIn = computed(() => jwtToken.value.length > 0)

  function setJwtToken(token: string, isLocalStorage = false) {
    const state = isLocalStorage ? _localJwtToken : _sessionJwtToken
    state.value = token
    console.log(parseJwt())
  }

  function parseJwt(): JwtPayload {
    const base64Url = jwtToken.value.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    return JSON.parse(jsonPayload)
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
    parseJwt,
  }
})
