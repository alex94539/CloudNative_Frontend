export default {
  login(token: string, rememberMe = false) {
    const authStore = useAuthStore()
    const { setJwtToken, parseJwt } = authStore
    setJwtToken(token, rememberMe)
    const jwtPayload = parseJwt()

    const userStore = useUserStore()
    const { set: setUser } = userStore
    setUser(jwtPayload, rememberMe)
  },
  logout() {
    const authStore = useAuthStore()
    const { clear: clearAuth } = authStore
    clearAuth()

    const userStore = useUserStore()
    const { clear: clearUser } = userStore
    clearUser()
  },
}
