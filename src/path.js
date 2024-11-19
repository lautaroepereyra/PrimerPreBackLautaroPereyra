import { fileURLToPath } from 'url'
import { dirname } from 'path'
export const __filename = fileURLToPath(import.meta.url)
console.log(__filename)
export const __dirname = dirname(__filename)
console.log(__dirname);