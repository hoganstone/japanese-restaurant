import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminSignin, adminSignout, checkAuth } from '@/api'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)

  async function login(email, password) {
    const res = await adminSignin({ username: email, password })
    if (res.data.success) {
      const { token, expired } = res.data
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`
      isAuthenticated.value = true
      return true
    }
    return false
  }

  async function logout() {
    await adminSignout()
    document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    isAuthenticated.value = false
    user.value = null
  }

  async function verify() {
    try {
      const res = await checkAuth()
      isAuthenticated.value = res.data.success
      return res.data.success
    } catch {
      isAuthenticated.value = false
      return false
    }
  }

  return { isAuthenticated, user, login, logout, verify }
})
