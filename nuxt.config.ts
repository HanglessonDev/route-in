// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  app: {
    head: {
      title: 'Route-in',
      htmlAttrs: {
        lang: 'pt-BR',
      },
    },
  },
  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'last' }],
    // configPath: 'tailwind.config',
    exposeConfig: true,
    viewer: true,
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
      },
      defaults: {
        VTextField: {
          variant: 'outlined',
          density: 'compact',
        },
        VSelect: {
          variant: 'outlined',
          density: 'compact',
        },
        VAutocomplete: {
          variant: 'outlined',
          density: 'compact',
        },
      },
    },
  },
});
