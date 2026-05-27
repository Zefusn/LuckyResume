import api from './index'
import type { Resume, ResumeContent } from '@/types'

export const resumeApi = {
  getList(params?: { page?: number; limit?: number }) {
    return api.get<{ list: Resume[]; total: number }>('/resumes', { params })
  },

  getById(id: string) {
    return api.get<Resume>(`/resumes/${id}`)
  },

  create(data: { title: string; templateId: string; content?: Partial<ResumeContent> }) {
    return api.post<Resume>('/resumes', data)
  },

  update(id: string, data: Partial<Resume>) {
    return api.put<Resume>(`/resumes/${id}`, data)
  },

  updateContent(id: string, content: Partial<ResumeContent>, extra?: { templateColor?: string; templateStyle?: string }) {
    return api.put<Resume>(`/resumes/${id}/content`, { content, ...extra })
  },

  delete(id: string) {
    return api.delete<void>(`/resumes/${id}`)
  },

  restore(id: string) {
    return api.post<void>(`/resumes/${id}/restore`)
  },

  permanentDelete(id: string) {
    return api.delete<void>(`/resumes/${id}/permanent`)
  },

  duplicate(id: string) {
    return api.post<Resume>(`/resumes/${id}/duplicate`)
  },

  getShareLink(id: string, expireType: 'forever' | '24h' | '7d') {
    return api.post<{ link: string; expireAt: string }>(`/resumes/${id}/share`, { expireType })
  },

  exportPdf(id: string) {
    return api.get<Blob>(`/resumes/${id}/export/pdf`, { responseType: 'blob' })
  },

  exportWord(id: string) {
    return api.get<Blob>(`/resumes/${id}/export/word`, { responseType: 'blob' })
  },

  exportImage(id: string) {
    return api.get<Blob>(`/resumes/${id}/export/image`, { responseType: 'blob' })
  },

  getTrashList(params?: { page?: number; limit?: number }) {
    return api.get<{ list: Resume[]; total: number }>('/resumes/trash', { params })
  }
}
