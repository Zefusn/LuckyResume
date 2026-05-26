export interface User {
  id: string
  username: string
  phone: string
  email?: string
  avatar?: string
  nickname: string
  createdAt: string
}

export interface Resume {
  id: string
  userId: string
  title: string
  templateId: string
  content: ResumeContent
  isPublic: boolean
  shareLink?: string
  shareExpireAt?: string
  createdAt: string
  updatedAt: string
}

export interface ResumeContent {
  basic: BasicInfo
  intention: JobIntention
  education: Education[]
  work: WorkExperience[]
  project: ProjectExperience[]
  awards: Award[]
  skills: Skill[]
  training: Training[]
  selfEvaluation: string
  hobbies: string[]
  languages: Language[]
  portfolio: Portfolio[]
}

export interface BasicInfo {
  name: string
  avatar?: string
  gender: string
  birthDate: string
  phone: string
  email: string
  location: string
  politicalStatus?: string
  workYears: number
  jobTitle?: string
  personalWebsite?: string
  expectSalary?: string
}

export interface JobIntention {
  position: string
  city: string
  salary: string
  jobType: string
  industry: string
}

export interface Education {
  id: string
  school: string
  major: string
  degree: string
  startDate: string
  endDate: string
  description?: string
  gpa?: string
  rank?: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
  achievements: string[]
}

export interface ProjectExperience {
  id: string
  name: string
  role: string
  startDate: string
  endDate: string
  description: string
  technologies: string[]
  achievements: string[]
}

export interface Award {
  id: string
  name: string
  date: string
  issuer?: string
  description?: string
}

export interface Skill {
  id: string
  name: string
  level: number
  description?: string
}

export interface Training {
  id: string
  institution: string
  course: string
  startDate: string
  endDate: string
  description?: string
  certificate?: string
}

export interface Language {
  id: string
  name: string
  level: string
  certificate?: string
}

export interface Portfolio {
  id: string
  title: string
  url?: string
  image?: string
  description?: string
}

export interface Template {
  id: string
  name: string
  category: string
  style: string
  thumbnail: string
  previewImages: string[]
  description: string
  tags: string[]
  isFree: boolean
  downloadCount: number
  favoriteCount: number
  createdAt: string
}

export interface ResumeScore {
  total: number
  sections: {
    name: string
    score: number
    suggestions: string[]
  }[]
  keywords: string[]
  improvements: string[]
}

export interface AIGenerateRequest {
  position: string
  workYears: number
  education: string
  skills?: string[]
  style?: 'professional' | 'creative' | 'academic'
}

export interface AIOptimizeRequest {
  resumeId: string
  section?: string
  instruction?: string
}

export interface LoginRequest {
  phone?: string
  code?: string
  wechatCode?: string
  qqCode?: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
