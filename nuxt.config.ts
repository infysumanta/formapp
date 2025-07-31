// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  ui: {
    prefix: "Nuxt",
    colorMode: false,
  },
  modules: ["@nuxt/eslint", "@nuxt/scripts", "@nuxt/ui", "@nuxt/image"],
});
