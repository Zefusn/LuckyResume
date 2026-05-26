import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDB } from '../db/init.js'
import { authMiddleware, generateToken } from '../middleware/auth.js'

const router = Router()

const smsCodes = new Map()

router.post('/sms-code', (req, res) => {
  const { phone } = req.body
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return res.json({ code: 400, message: '手机号格式不正确' })
  }

  const code = Math.random().toString().slice(2, 8)
  smsCodes.set(phone, { code, expireAt: Date.now() + 5 * 60 * 1000 })

  console.log(`[SMS验证码] ${phone}: ${code}`)

  res.json({ code: 200, message: '验证码已发送（开发模式：控制台查看）', data: null })
})

router.post('/login/phone', async (req, res) => {
  const { phone, code } = req.body

  if (!phone || !code) {
    return res.json({ code: 400, message: '请填写手机号和验证码' })
  }

  const stored = smsCodes.get(phone)
  if (!stored || stored.code !== code || stored.expireAt < Date.now()) {
    return res.json({ code: 400, message: '验证码错误或已过期' })
  }

  smsCodes.delete(phone)

  const db = await getDB()
  let user = db.data.users.find(u => u.phone === phone)

  if (!user) {
    user = {
      id: uuidv4(),
      phone,
      nickname: `用户${phone.slice(-4)}`,
      avatar: null,
      email: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    db.data.users.push(user)
    await db.write()
  }

  const token = generateToken(user.id)

  res.json({
    code: 200,
    message: '登录成功',
    data: { token, user: formatUser(user) }
  })
})

router.post('/login/test', async (req, res) => {
  const db = await getDB()
  let user = db.data.users[0]

  if (!user) {
    user = {
      id: uuidv4(),
      phone: '13800138000',
      nickname: '测试用户',
      avatar: null,
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    db.data.users.push(user)
    await db.write()
  }

  const token = generateToken(user.id)
  res.json({ code: 200, message: '登录成功', data: { token, user: formatUser(user) } })
})

router.get('/me', authMiddleware, async (req, res) => {
  const db = await getDB()
  const user = db.data.users.find(u => u.id === req.userId)

  if (!user) {
    return res.json({ code: 404, message: '用户不存在' })
  }

  res.json({ code: 200, data: formatUser(user) })
})

router.put('/profile', authMiddleware, async (req, res) => {
  const { nickname, email, avatar } = req.body
  const db = await getDB()
  const userIndex = db.data.users.findIndex(u => u.id === req.userId)

  if (userIndex === -1) {
    return res.json({ code: 404, message: '用户不存在' })
  }

  if (nickname !== undefined) db.data.users[userIndex].nickname = nickname
  if (email !== undefined) db.data.users[userIndex].email = email
  if (avatar !== undefined) db.data.users[userIndex].avatar = avatar
  db.data.users[userIndex].updatedAt = new Date().toISOString()

  await db.write()

  res.json({ code: 200, data: formatUser(db.data.users[userIndex]) })
})

function formatUser(user) {
  return {
    id: user.id,
    phone: user.phone,
    nickname: user.nickname,
    avatar: user.avatar,
    email: user.email,
    createdAt: user.createdAt
  }
}

export default router
