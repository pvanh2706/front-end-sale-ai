import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  function login(email: string, password: string): boolean {
    if (email === 'admin' && password === '123') {
      const fakeToken = `mock-token-${Date.now()}`
      token.value = fakeToken
      localStorage.setItem('token', fakeToken)
      return true
    }
    return false
  }

  function logout() {
    token.value = null
    localStorage.removeItem('token')
  }

  return { token, isAuthenticated, login, logout }
})
