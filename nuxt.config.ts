// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	ssr: false,

	modules: [
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxt/image',
		'@nuxt/test-utils',
		'vuetify-nuxt-module',
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt',
		'@nuxtjs/tailwindcss',
		'@vueuse/nuxt',
	],
	components: [{ path: '~/modules/offlineDB/components', pathPrefix: false }],
	plugins: ['~/plugins/dexie.client.ts'],
	app: {
		head: {
			title: 'Route-in App',
			htmlAttrs: {
				lang: 'pt-BR',
			},
		},
	},
	runtimeConfig: {
		hereApiKey: process.env.HERE_API_KEY, // Accessible only on the server
		public: {
			hereApiKey: process.env.HERE_API_KEY,
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
					variant: 'underlined',
					density: 'compact',
				},
				VSelect: {
					variant: 'underlined',
					density: 'compact',
				},
				VAutocomplete: {
					variant: 'underlined',
					density: 'compact',
				},
			},
		},
	},
})
