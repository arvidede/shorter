import fs from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const promisify = async (fn: () => void) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(fn())
        } catch (e: unknown) {
            console.error(e)
            reject()
        }
    })
}

export class DB<T = string> {
    db: Map<string, T>
    file: string

    constructor() {
        this.db = new Map()
        this.file = join(__dirname, '../../dump.txt')
        this.load()
    }

    get(key: string) {
        return this.db.get(key)
    }

    set(key: string, value: T) {
        try {
            this.db.set(key, value)
            this.save()
            return true
        } catch (e: unknown) {
            console.error('Failed to save to db:', e)
            return false
        }
    }

    has(key: string): boolean {
        return this.db.has(key)
    }

    private async load() {
        return promisify(() => {
            if (fs.existsSync(this.file)) {
                this.db = new Map(
                    JSON.parse(
                        fs.readFileSync(this.file, { encoding: 'utf-8' })
                    )
                )
            }
        })
    }

    private async save() {
        return promisify(() => {
            fs.writeFileSync(
                this.file,
                JSON.stringify(Array.from(this.db.entries()))
            )
        })
    }
}

let db: DB
export const getDB = () => {
    if (!db) db = new DB()
    return db
}
