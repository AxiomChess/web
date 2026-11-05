import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const source = join(root, "..", "design", "tokens", "tokens.css")
const targetDir = join(root, "styles")
const target = join(targetDir, "tokens.css")

if (!existsSync(source)) {
  console.error(
    `Missing design tokens at ${source}. Clone AxiomChess/design as a sibling of web.`,
  )
  process.exit(1)
}

mkdirSync(targetDir, { recursive: true })
copyFileSync(source, target)
console.log(`Synced tokens: ${source} -> ${target}`)
