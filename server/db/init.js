import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbDir = join(__dirname, 'data')
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

const file = join(dbDir, 'db.json')
const adapter = new JSONFile(file)

const defaultData = {
  users: [],
  resumes: [],
  templates: [],
  favorites: []
}

let db

export async function getDB() {
  if (!db) {
    db = new Low(adapter, defaultData)
    await db.read()
    db.data = db.data || defaultData
    await db.write()
  }
  return db
}

export async function initDB() {
  const database = await getDB()
  console.log('Database initialized')
  return database
}
