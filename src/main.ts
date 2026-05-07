import './assets/styles/themes.css'
import './assets/main.css'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './router'
import App from './App.vue'
import { useThemeStore } from './stores/theme'

async function clearDevBrowserCaches() {
	if (!import.meta.env.DEV || typeof window === 'undefined') {
		return
	}

	try {
		if ('serviceWorker' in navigator) {
			const registrations = await navigator.serviceWorker.getRegistrations()
			await Promise.allSettled(registrations.map((registration) => registration.unregister()))
		}

		if ('caches' in window) {
			const cacheKeys = await caches.keys()
			await Promise.allSettled(cacheKeys.map((cacheKey) => caches.delete(cacheKey)))
		}

		const libraryCachePrefix = 'library.tree.cache.'
		const localStorageKeysToRemove: string[] = []
		for (let i = 0; i < localStorage.length; i += 1) {
			const key = localStorage.key(i)
			if (key?.startsWith(libraryCachePrefix)) {
				localStorageKeysToRemove.push(key)
			}
		}

		const staleThemeKeys = ['salio.theme', 'salio.color-mode', 'theme']
		localStorageKeysToRemove.push(...staleThemeKeys)
		localStorageKeysToRemove.forEach((key) => localStorage.removeItem(key))
	} catch (error) {
		console.warn('DEV cache cleanup failed:', error)
	}
}

void clearDevBrowserCaches()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)

const themeStore = useThemeStore(pinia)
themeStore.applyTheme()
themeStore.applyColorMode()

app.mount('#app')
