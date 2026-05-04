#!/usr/bin/env node

/**
 * start.mjs — Arranca OpenCode con variables de entorno cargadas desde .env
 *
 * Cross-platform: Windows, macOS, Linux.
 * Node >= 18 requerido.
 *
 * Uso:
 *   node start.mjs          # abre el directorio actual
 *   node start.mjs tui      # modo TUI
 *   node start.mjs .        # abre proyecto actual
 */

import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '.env')

// 1. Cargar .env
if (existsSync(envPath)) {
  console.log('🔑 Cargando variables desde .env...')
  const content = readFileSync(envPath, 'utf-8')
  const lines = content.split('\n')
  let count = 0
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const match = trimmed.match(/^([^=]+)=(.*)/)
    if (match) {
      const name = match[1].trim()
      const value = match[2].trim()
      if (value) {
        process.env[name] = value
        console.log(`   ✅ ${name}`)
        count++
      }
    }
  }
  if (count === 0) console.log('   ⚠️  No se encontraron variables con valor')
} else {
  console.log('⚠️  .env no encontrado. Creá uno con tus API keys.')
}

// 2. Determinar el comando
const mode = process.argv[2] || '.'

console.log(`\n🚀 Arrancando OpenCode en: ${mode}\n`)

// 3. Lanzar opencode
const child = spawn('opencode', [mode], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
})

child.on('close', (code) => {
  process.exit(code)
})
