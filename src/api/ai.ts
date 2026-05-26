import api from './index'
import type { AIGenerateRequest, AIOptimizeRequest, ResumeScore } from '@/types'

export const aiApi = {
  generateResume(data: AIGenerateRequest) {
    return api.post<any>('/ai/generate', data)
  },

  generateSection(section: string, context: any) {
    return api.post<string>('/ai/generate-section', { section, context })
  },

  optimizeResume(data: AIOptimizeRequest) {
    return api.post<string>('/ai/optimize', data)
  },

  polishText(text: string) {
    return api.post<string>('/ai/polish', { text })
  },

  diagnose(resumeId: string) {
    return api.post<ResumeScore>('/ai/diagnose', { resumeId })
  },

  matchJD(resumeId: string, jd: string) {
    return api.post<{ matchScore: number; keywords: string[]; suggestions: string[] }>('/ai/match-jd', { resumeId, jd })
  },

  generateCoverLetter(data: { position: string; company: string; resumeId: string }) {
    return api.post<string>('/ai/cover-letter', data)
  },

  generateSelfIntro(data: { resumeId: string; style: 'formal' | 'casual' | 'academic' }) {
    return api.post<string>('/ai/self-intro', data)
  },

  streamGenerate(data: AIGenerateRequest, onMessage: (text: string) => void, onDone: () => void) {
    const eventSource = new EventSource(`/api/ai/generate-stream?${new URLSearchParams(data as any)}`)
    eventSource.onmessage = (event) => {
      onMessage(event.data)
    }
    eventSource.addEventListener('done', () => {
      eventSource.close()
      onDone()
    })
    eventSource.onerror = () => {
      eventSource.close()
    }
    return () => eventSource.close()
  }
}
