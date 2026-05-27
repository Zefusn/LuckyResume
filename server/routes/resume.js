import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDB } from '../db/init.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

const defaultContent = {
  basic: { name: '', gender: '', birthDate: '', phone: '', email: '', location: '', workYears: 0 },
  intention: { position: '', city: '', salary: '', jobType: '', industry: '' },
  education: [], work: [], project: [], awards: [],
  skills: [], training: [], selfEvaluation: '', hobbies: [],
  languages: [], portfolio: []
}

router.get('/', authMiddleware, async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const db = await getDB()

  const userResumes = db.data.resumes.filter(r => r.userId === req.userId && !r.deletedAt)
  userResumes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  const start = (page - 1) * limit
  const list = userResumes.slice(start, start + Number(limit)).map(formatResume)

  res.json({ code: 200, data: { list, total: userResumes.length } })
})

router.get('/trash', authMiddleware, async (req, res) => {
  const db = await getDB()
  const list = db.data.resumes
    .filter(r => r.userId === req.userId && r.deletedAt)
    .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt))
    .map(formatResume)

  res.json({ code: 200, data: { list, total: list.length } })
})

router.get('/:id', async (req, res) => {
  const db = await getDB()
  const resume = db.data.resumes.find(r => r.id === req.params.id && !r.deletedAt)

  if (!resume) {
    return res.json({ code: 404, message: '简历不存在' })
  }

  res.json({ code: 200, data: formatResume(resume) })
})

router.post('/', authMiddleware, async (req, res) => {
  const { title = '未命名简历', templateId = 'default', content } = req.body
  const db = await getDB()

  const resume = {
    id: uuidv4(),
    userId: req.userId,
    title,
    templateId,
    templateColor: '#18a058',
    templateStyle: 'default',
    content: { ...defaultContent, ...content },
    isPublic: false,
    shareLink: null,
    shareExpireAt: null,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  db.data.resumes.push(resume)
  await db.write()

  res.json({ code: 200, data: formatResume(resume) })
})

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, templateId, templateColor, templateStyle, content, isPublic } = req.body
  const db = await getDB()
  const index = db.data.resumes.findIndex(r => r.id === req.params.id && r.userId === req.userId)

  if (index === -1) {
    return res.json({ code: 404, message: '简历不存在' })
  }

  if (title !== undefined) db.data.resumes[index].title = title
  if (templateId !== undefined) db.data.resumes[index].templateId = templateId
  if (templateColor !== undefined) db.data.resumes[index].templateColor = templateColor
  if (templateStyle !== undefined) db.data.resumes[index].templateStyle = templateStyle
  if (content !== undefined) db.data.resumes[index].content = content
  if (isPublic !== undefined) db.data.resumes[index].isPublic = isPublic
  db.data.resumes[index].updatedAt = new Date().toISOString()

  await db.write()

  res.json({ code: 200, data: formatResume(db.data.resumes[index]) })
})

router.put('/:id/content', authMiddleware, async (req, res) => {
  const { content, templateColor, templateStyle } = req.body
  const db = await getDB()
  const index = db.data.resumes.findIndex(r => r.id === req.params.id && r.userId === req.userId)

  if (index === -1) {
    return res.json({ code: 404, message: '简历不存在' })
  }

  if (content) {
    db.data.resumes[index].content = { ...db.data.resumes[index].content, ...content }
  }
  if (templateColor !== undefined) {
    db.data.resumes[index].templateColor = templateColor
  }
  if (templateStyle !== undefined) {
    db.data.resumes[index].templateStyle = templateStyle
  }
  db.data.resumes[index].updatedAt = new Date().toISOString()

  await db.write()

  res.json({ code: 200, data: formatResume(db.data.resumes[index]) })
})

router.delete('/:id', authMiddleware, async (req, res) => {
  const db = await getDB()
  const index = db.data.resumes.findIndex(r => r.id === req.params.id && r.userId === req.userId)

  if (index !== -1) {
    db.data.resumes[index].deletedAt = new Date().toISOString()
    await db.write()
  }

  res.json({ code: 200, message: '已移至回收站' })
})

router.delete('/', authMiddleware, async (req, res) => {
  const db = await getDB()
  let count = 0
  db.data.resumes.forEach(r => {
    if (r.userId === req.userId && !r.deletedAt) {
      r.deletedAt = new Date().toISOString()
      count++
    }
  })
  await db.write()
  res.json({ code: 200, message: `已清空 ${count} 份简历`, data: { count } })
})

router.post('/:id/restore', authMiddleware, async (req, res) => {
  const db = await getDB()
  const index = db.data.resumes.findIndex(r => r.id === req.params.id && r.userId === req.userId)

  if (index !== -1) {
    db.data.resumes[index].deletedAt = null
    db.data.resumes[index].updatedAt = new Date().toISOString()
    await db.write()
  }

  res.json({ code: 200, message: '已恢复' })
})

router.delete('/:id/permanent', authMiddleware, async (req, res) => {
  const db = await getDB()
  db.data.resumes = db.data.resumes.filter(r => !(r.id === req.params.id && r.userId === req.userId && r.deletedAt))
  await db.write()

  res.json({ code: 200, message: '已永久删除' })
})

router.post('/:id/duplicate', authMiddleware, async (req, res) => {
  const db = await getDB()
  const original = db.data.resumes.find(r => r.id === req.params.id && r.userId === req.userId)

  if (!original) {
    return res.json({ code: 404, message: '简历不存在' })
  }

  const newResume = {
    ...original,
    id: uuidv4(),
    title: `${original.title} - 副本`,
    shareLink: null,
    shareExpireAt: null,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  db.data.resumes.push(newResume)
  await db.write()

  res.json({ code: 200, data: formatResume(newResume) })
})

router.post('/:id/share', authMiddleware, async (req, res) => {
  const { expireType = '7d' } = req.body
  const db = await getDB()
  const index = db.data.resumes.findIndex(r => r.id === req.params.id && r.userId === req.userId)

  if (index === -1) {
    return res.json({ code: 404, message: '简历不存在' })
  }

  const shareLink = uuidv4().replace(/-/g, '').slice(0, 12)
  let expireAt = null

  if (expireType === '24h') {
    expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  } else if (expireType === '7d') {
    expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }

  db.data.resumes[index].shareLink = shareLink
  db.data.resumes[index].shareExpireAt = expireAt
  await db.write()

  res.json({
    code: 200,
    data: {
      link: `${req.protocol}://${req.get('host')}/preview/${req.params.id}`,
      expireAt
    }
  })
})

function formatResume(row) {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    templateId: row.templateId,
    templateColor: row.templateColor || '#18a058',
    templateStyle: row.templateStyle || 'default',
    content: row.content || defaultContent,
    isPublic: Boolean(row.isPublic),
    shareLink: row.shareLink,
    shareExpireAt: row.shareExpireAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}

export default router
