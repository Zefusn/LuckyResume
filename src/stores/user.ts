import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { authApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string>(localStorage.getItem('token') || '')
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value)
  const userInfo = computed(() => user.value)

  async function fetchUser() {
    if (!token.value) return
    loading.value = true
    try {
      const data = await authApi.getCurrentUser()
      user.value = data
    } catch (error) {
      console.error('获取用户信息失败', error)
      logout()
    } finally {
      loading.value = false
    }
  }

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUser(newUser: User) {
    user.value = newUser
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  async function updateProfile(data: Partial<User>) {
    const result = await authApi.updateProfile(data)
    user.value = result
    return result
  }

  return {
    user,
    token,
    loading,
    isLoggedIn,
    userInfo,
    fetchUser,
    setToken,
    setUser,
    logout,
    updateProfile
  }
})
