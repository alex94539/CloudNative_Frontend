export default {
  login(token: string, rememberMe = false) {
    const authStore = useAuthStore()
    const { setJwtToken, parseJwt } = authStore
    setJwtToken(token, rememberMe)
    const { _id, ...jwtPayload } = parseJwt()

    const userStore = useUserStore()
    const { set: setUser } = userStore
    setUser({ id: _id, ...jwtPayload }, rememberMe)
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
