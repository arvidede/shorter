import express from 'express'
import { getDB } from './utils/db'
import { generateId } from './utils/id'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(express.json())
app.use(express.static(resolve(__dirname, 'public')))

app.get('/:id', (req, res) => {
    const { id } = req.params
    const db = getDB()
    const url = db.get(id)
    if (url) return res.redirect(url)
    return res.status(404).end()
})

interface Body {
    url: string
    stripQueryParams: boolean
}

app.put<unknown, unknown, Body>('/', (req, res) => {
    let { url, stripQueryParams } = req.body
    if (!url) return res.status(400).send('Missing parameter url in body')
    const db = getDB()
    const id = generateId(db)
    if (stripQueryParams) {
        const parsedUrl = new URL(url)
        url = `${parsedUrl.origin}${parsedUrl.pathname}`
    }
    const saved = db.set(id, url)
    if (saved) return res.status(201).send(id)
    return res.status(500).end()
})

app.listen(3000, () => console.log('Ready on port 3000'))
