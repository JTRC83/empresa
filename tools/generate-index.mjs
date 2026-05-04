#!/usr/bin/env node

/**
 * generate-index.mjs — Genera index.md en cada carpeta del vault
 * y un Vault-Index.md raíz con resumen completo.
 *
 * Token-efficient: los index.md actúan como "mapa de contexto" para que
 * la IA vea la estructura del vault sin leer cada archivo individual.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const EXCLUDE_DIRS = new Set([
  '.git', '.obsidian', '.opencode', '.atl', '.engram',
  'node_modules', 'tools', '__pycache__', '.DS_Store'
])

const EXCLUDE_FILES = new Set([
  '.gitignore', '.gitattributes', 'package.json', 'package-lock.json',
  'opencode.jsonc', 'AGENTS.md', 'Vault-Index.md'
])

function isExcludedDir(name) {
  return EXCLUDE_DIRS.has(name) || name.startsWith('.')
}

// ─── Frontmatter parser ───────────────────────────────────────────────────────

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { _bodyStart: match ? match[0].length : 0 }
  const fm = { _bodyStart: match[0].length }
  let currentKey = null
  for (const line of match[1].split('\n')) {
    const keyMatch = line.match(/^(\w[\w-]*):\s*(.*)/)
    if (keyMatch) {
      currentKey = keyMatch[1]
      let val = keyMatch[2].trim()
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      fm[currentKey] = val || []
    } else if (currentKey && line.startsWith('  - ')) {
      let val = line.slice(4).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      if (Array.isArray(fm[currentKey])) {
        fm[currentKey].push(val)
      } else {
        fm[currentKey] = [val]
      }
    }
  }
  return fm
}

function extractFirstParagraph(content, bodyStart) {
  const body = content.slice(bodyStart)
  const lines = body.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    // Skip headings, callouts, code blocks
    if (trimmed.startsWith('#') || trimmed.startsWith('>') || trimmed.startsWith('```')) continue
    // Skip single numbers or very short noise (PDF artifacts)
    if (/^\d{1,3}$/.test(trimmed)) continue
    if (trimmed.length < 10) continue
    if (trimmed.startsWith('![') || trimmed.startsWith('[[')) {
      // Wikilink solo — tomarlo como descripción mínima
      return trimmed
    }
    return trimmed.length > 150 ? trimmed.slice(0, 147) + '...' : trimmed
  }
  return ''
}

function getTitle(filePath, fm) {
  if (fm.title) return fm.title
  const name = basename(filePath, '.md')
  if (name === 'index') {
    return basename(dirname(filePath))
  }
  return name
}

function getDescription(fm, content) {
  if (fm.description || fm.summary) return fm.description || fm.summary
  // Fallback: primer párrafo del cuerpo
  if (typeof fm._bodyStart === 'number') {
    return extractFirstParagraph(content, fm._bodyStart)
  }
  return ''
}

function getTags(fm) {
  const tags = fm.tags || []
  return Array.isArray(tags) ? tags : [tags]
}

// ─── Tree builder ─────────────────────────────────────────────────────────────

function buildTree(dir, prefix = '', depth = 0) {
  const entries = readdirSync(dir).filter(e => {
    if (e.startsWith('.')) return false
    if (EXCLUDE_DIRS.has(e)) return false
    if (EXCLUDE_FILES.has(e)) return false
    return true
  }).sort()

  const lines = []
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const fullPath = join(dir, entry)
    const isLast = i === entries.length - 1
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      lines.push(`${prefix}${isLast ? '└──' : '├──'} 📁 ${entry}/`)
      const childPrefix = prefix + (isLast ? '    ' : '│   ')
      lines.push(...buildTree(fullPath, childPrefix, depth + 1))
    } else if (stat.isFile()) {
      const ext = entry.split('.').pop()?.toLowerCase()
      const icon = ext === 'md' ? '📄' : ext === 'canvas' ? '🎨' : ext === 'base' ? '🗃️' : '📎'
      if (ext === 'md' && entry === 'index.md') continue // no mostrar index.md en el árbol
      lines.push(`${prefix}${isLast ? '└──' : '├──'} ${icon} ${entry}`)
    }
  }
  return lines
}

// ─── File info collector ──────────────────────────────────────────────────────

function collectFiles(dir, baseDir = dir) {
  const entries = readdirSync(dir).filter(e => {
    if (e.startsWith('.')) return false
    if (EXCLUDE_DIRS.has(e)) return false
    if (EXCLUDE_FILES.has(e)) return false
    return true
  }).sort()

  const files = []
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...collectFiles(fullPath, baseDir))
    } else if (stat.isFile() && entry.endsWith('.md') && entry !== 'index.md') {
      const relPath = relative(baseDir, fullPath).replace(/\\/g, '/')
      const content = readFileSync(fullPath, 'utf-8')
      const fm = extractFrontmatter(content)
      files.push({
        path: relPath,
        title: getTitle(fullPath, fm),
        description: getDescription(fm, content),
        tags: getTags(fm),
        ext: entry.split('.').pop()?.toLowerCase()
      })
    }
  }
  return files
}

// ─── Index generator per directory ────────────────────────────────────────────

function generateDirIndex(dirPath) {
  const dirName = basename(dirPath)
  const tree = buildTree(dirPath)
  const files = collectFiles(dirPath)

  // Agrupar por subcarpeta
  const grouped = {}
  for (const f of files) {
    const folder = dirname(f.path) === '.' ? '/' : dirname(f.path)
    if (!grouped[folder]) grouped[folder] = []
    grouped[folder].push(f)
  }

  let md = '---\ntype: index\nauto-generated: true\nfolder:'
  md += ` "${dirName}"\n---\n\n`
  md += `# ${dirName}\n\n`

  if (tree.length > 0) {
    md += '```\n'
    md += tree.join('\n')
    md += '\n```\n\n'
  }

  for (const [folder, folderFiles] of Object.entries(grouped)) {
    const label = folder === '/' ? 'Raíz' : folder
    md += `## ${label}\n\n`
    for (const f of folderFiles) {
      md += `- [[${f.path.replace('.md', '')}|${f.title}]]`
      if (f.description) md += ` — ${f.description}`
      if (f.tags.length > 0) md += ` \`#${f.tags.join(' #')}\``
      md += '\n'
    }
    md += '\n'
  }

  return md
}

// ─── Vault-wide index (root) ──────────────────────────────────────────────────

function generateVaultIndex(dirs) {
  let md = '---\ntype: index\nauto-generated: true\nscope: vault\n---\n\n'
  md += '# Vault Index\n\n'
  md += '> Mapa global del vault con descripciones compactas. Para tags y detalle completo, abri el `index.md` de cada carpeta.\n\n'

  md += '## Arbol\n\n```\n'
  md += buildTree(ROOT).join('\n')
  md += '\n```\n\n'

  // Por cada carpeta, listar archivos con descripcion
  for (const dir of dirs) {
    const dirName = basename(dir)
    const files = collectFiles(dir)
    if (files.length === 0) continue

    md += `## ${dirName} (${files.length})\n\n`
    for (const f of files) {
      // Descripcion compacta: max 120 chars
      const desc = f.description
        ? f.description.length > 120 ? f.description.slice(0, 117) + '...' : f.description
        : ''

      const wikiPath = `${relative(ROOT, dir).replace(/\\/g, '/')}/${f.path.replace('.md', '')}`
      md += `- [[${wikiPath}|${f.title}]]`
      if (desc) md += ` — ${desc}`
      md += '\n'
    }
    md += '\n'
  }

  md += '---\n*Generado automaticamente. No editar manualmente.*\n'
  return md
}

function countMdFiles(dir) {
  let count = 0
  try {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith('.') || EXCLUDE_DIRS.has(entry)) continue
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        count += countMdFiles(fullPath)
      } else if (stat.isFile() && entry.endsWith('.md') && entry !== 'index.md') {
        count++
      }
    }
  } catch { /* skip */ }
  return count
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function getContentDirs(root) {
  const dirs = []
  try {
    for (const entry of readdirSync(root)) {
      const fullPath = join(root, entry)
      if (isExcludedDir(entry)) continue
      if (!statSync(fullPath).isDirectory()) continue
      if (entry.startsWith('.')) continue
      dirs.push(fullPath)
    }
  } catch { /* skip */ }
  return dirs.sort()
}

function main() {
  console.log('🔍 Generando índices del vault...')

  const contentDirs = getContentDirs(ROOT)

  for (const dir of contentDirs) {
    const indexMd = generateDirIndex(dir)
    const indexPath = join(dir, 'index.md')
    writeFileSync(indexPath, indexMd, 'utf-8')
    console.log(`  ✅ ${relative(ROOT, indexPath)}`)
  }

  // Vault-wide index at root
  const vaultIndex = generateVaultIndex(contentDirs)
  const vaultIndexPath = join(ROOT, 'Vault-Index.md')
  writeFileSync(vaultIndexPath, vaultIndex, 'utf-8')
  console.log(`  ✅ Vault-Index.md (global)`)

  console.log(`\n📊 ${contentDirs.length} carpetas indexadas.`)
}

main()
