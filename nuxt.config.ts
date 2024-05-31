// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-primevue', '@nuxt/eslint', '@vueuse/nuxt', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  primevue: {},
  runtimeConfig: {
    public: {
      apiBase: 'http://140.113.194.228:9999/',
    },
  },
  ssr: true,
})
