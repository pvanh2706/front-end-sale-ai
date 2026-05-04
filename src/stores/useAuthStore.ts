import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserProfile {
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<UserProfile | null>(
    token.value ? { name: 'Quản trị viên', email: 'admin@salio.ai' } : null,
  )

  const isAuthenticated = computed(() => !!token.value)

  function login(email: string, password: string): boolean {
    if (email === 'admin' && password === '123') {
      const fakeToken = `mock-token-${Date.now()}`
      token.value = fakeToken
      localStorage.setItem('token', fakeToken)
      user.value = { name: 'Quản trị viên', email: 'admin@salio.ai' }
      return true
    }
    return false
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isAuthenticated, login, logout }
})
