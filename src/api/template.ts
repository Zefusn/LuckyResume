import api from './index'
import type { Template } from '@/types'

export const templateApi = {
  getList(params?: { 
    page?: number
    limit?: number
    category?: string
    style?: string
    keyword?: string
    sort?: 'newest' | 'popular' | 'downloads'
  }) {
    return api.get<{ list: Template[]; total: number }>('/templates', { params })
  },

  getById(id: string) {
    return api.get<Template>(`/templates/${id}`)
  },

  getCategories() {
    return api.get<string[]>('/templates/categories')
  },

  getStyles() {
    return api.get<string[]>('/templates/styles')
  },

  favorite(id: string) {
    return api.post<void>(`/templates/${id}/favorite`)
  },

  unfavorite(id: string) {
    return api.delete<void>(`/templates/${id}/favorite`)
  },

  getFavorites(params?: { page?: number; limit?: number }) {
    return api.get<{ list: Template[]; total: number }>('/templates/favorites', { params })
  },

  getRecent(params?: { limit?: number }) {
    return api.get<Template[]>('/templates/recent', { params })
  }
}
