export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/login')) {
    setPageLayout('blank')
  }
})
