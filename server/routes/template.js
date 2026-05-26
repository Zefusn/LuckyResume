import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDB } from '../db/init.js'
import { authMiddleware } from '../middleware/auth.js'
import { defaultTemplates } from '../data/templates.js'

const router = Router()

router.get('/', async (req, res) => {
  const { page = 1, limit = 20, category, style, keyword, sort = 'popular' } = req.query
  const db = await getDB()

  let templates = [...db.data.templates]

  if (category && category !== 'all') {
    templates = templates.filter(t => t.category === category)
  }
  if (style && style !== 'all') {
    templates = templates.filter(t => t.style === style)
  }
  if (keyword) {
    const kw = keyword.toLowerCase()
    templates = templates.filter(t =>
      t.name.toLowerCase().includes(kw) ||
      t.description.toLowerCase().includes(kw)
    )
  }

  if (sort === 'newest') {
    templates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sort === 'downloads') {
    templates.sort((a, b) => b.downloadCount - a.downloadCount)
  } else {
    templates.sort((a, b) => b.favoriteCount - a.favoriteCount)
  }

  const total = templates.length
  const start = (page - 1) * limit
  const list = templates.slice(start, start + Number(limit)).map(formatTemplate)

  res.json({ code: 200, data: { list, total } })
})

router.get('/categories', async (req, res) => {
  const db = await getDB()
  const categories = [...new Set(db.data.templates.map(t => t.category).filter(Boolean))]
  res.json({ code: 200, data: categories })
})

router.get('/styles', async (req, res) => {
  const db = await getDB()
  const styles = [...new Set(db.data.templates.map(t => t.style).filter(Boolean))]
  res.json({ code: 200, data: styles })
})

router.get('/favorites', authMiddleware, async (req, res) => {
  const db = await getDB()
  const userFavorites = db.data.favorites.filter(f => f.userId === req.userId)
  const templateIds = userFavorites.map(f => f.templateId)
  const list = db.data.templates
    .filter(t => templateIds.includes(t.id))
    .map(formatTemplate)

  res.json({ code: 200, data: { list, total: list.length } })
})

router.get('/:id', async (req, res) => {
  const db = await getDB()
  const template = db.data.templates.find(t => t.id === req.params.id)

  if (!template) {
    return res.json({ code: 404, message: '模板不存在' })
  }

  res.json({ code: 200, data: formatTemplate(template) })
})

router.post('/:id/favorite', authMiddleware, async (req, res) => {
  const db = await getDB()
  const exists = db.data.favorites.find(f => f.userId === req.userId && f.templateId === req.params.id)

  if (exists) {
    return res.json({ code: 400, message: '已收藏' })
  }

  db.data.favorites.push({
    id: uuidv4(),
    userId: req.userId,
    templateId: req.params.id,
    createdAt: new Date().toISOString()
  })

  const templateIndex = db.data.templates.findIndex(t => t.id === req.params.id)
  if (templateIndex !== -1) {
    db.data.templates[templateIndex].favoriteCount++
  }

  await db.write()
  res.json({ code: 200, message: '收藏成功' })
})

router.delete('/:id/favorite', authMiddleware, async (req, res) => {
  const db = await getDB()
  const index = db.data.favorites.findIndex(f => f.userId === req.userId && f.templateId === req.params.id)

  if (index !== -1) {
    db.data.favorites.splice(index, 1)

    const templateIndex = db.data.templates.findIndex(t => t.id === req.params.id)
    if (templateIndex !== -1 && db.data.templates[templateIndex].favoriteCount > 0) {
      db.data.templates[templateIndex].favoriteCount--
    }

    await db.write()
  }

  res.json({ code: 200, message: '已取消收藏' })
})

export async function initTemplates() {
  const db = await getDB()

  if (!db.data) {
    db.data = { users: [], resumes: [], templates: [], favorites: [] }
  }
  if (!db.data.templates) {
    db.data.templates = []
  }

  if (db.data.templates.length === 0) {
    console.log('初始化默认模板...')
    db.data.templates = defaultTemplates.map(t => ({
      ...t,
      previewImages: t.previewImages || [],
      tags: t.tags || [],
      createdAt: new Date().toISOString()
    }))
    await db.write()
    console.log(`已初始化 ${defaultTemplates.length} 个模板`)
  }
}

function formatTemplate(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    style: row.style,
    thumbnail: row.thumbnail,
    previewImages: row.previewImages || [],
    description: row.description,
    tags: row.tags || [],
    isFree: Boolean(row.isFree),
    downloadCount: row.downloadCount,
    favoriteCount: row.favoriteCount,
    createdAt: row.createdAt
  }
}

export default router
