import api from './index'
import type { User } from '@/types'

export const authApi = {
  sendSmsCode(phone: string) {
    return api.post<void>('/auth/sms-code', { phone })
  },

  loginByPhone(data: { phone: string; code: string }) {
    return api.post<{ token: string; user: User }>('/auth/login/phone', data)
  },

  loginByWechat(code: string) {
    return api.post<{ token: string; user: User }>('/auth/login/wechat', { code })
  },

  loginByQQ(code: string) {
    return api.post<{ token: string; user: User }>('/auth/login/qq', { code })
  },

  logout() {
    return api.post<void>('/auth/logout')
  },

  getCurrentUser() {
    return api.get<User>('/auth/me')
  },

  updateProfile(data: Partial<User>) {
    return api.put<User>('/auth/profile', data)
  },

  uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post<{ url: string }>('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
