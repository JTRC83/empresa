#!/usr/bin/env node

/**
 * qdrant-sync.mjs — Sincroniza el vault de Obsidian con Qdrant.
 *
 * Lee todos los .md del vault, los chunkea por secciones (## headings),
 * genera embeddings y los sube a una coleccion en Qdrant.
 *
 * ─── Embedding Providers ──────────────────────────────────────────────
 *
 *   transformers  LOCAL, GRATIS, sin API key, sin servidor
 *                 Modelo: Xenova/all-MiniLM-L6-v2 (384-dim, rapido)
 *                 Requiere: npm install @huggingface/transformers
 *
 *   ollama        LOCAL, GRATIS, requiere Ollama corriendo
 *                 Modelo recomendado: nomic-embed-text
 *                 ollama pull nomic-embed-text
 *
 *   openrouter    CLOUD, BARATO (~$0.02 por sync del vault entero)
 *                 OPENROUTER_API_KEY=sk-or-...
 *                 Modelo: openai/text-embedding-3-small
 *
 *   openai        CLOUD, requiere OPENAI_API_KEY
 *                 Modelo: text-embedding-3-small
 *
 * ─── Uso ─────────────────────────────────────────────────────────────
 *
 *   # Con Transformers.js (local, sin API key — recomendado)
 *   EMBEDDING_PROVIDER=transformers node tools/qdrant-sync.mjs
 *
 *   # Con Ollama (local, requiere ollama corriendo)
 *   EMBEDDING_PROVIDER=ollama EMBEDDING_MODEL=nomic-embed-text node tools/qdrant-sync.mjs
 *
 *   # Con OpenRouter (cloud, sin OpenAI)
 *   EMBEDDING_PROVIDER=openrouter OPENROUTER_API_KEY=sk-or-... node tools/qdrant-sync.mjs
 *
 *   # Buscar
 *   EMBEDDING_PROVIDER=transformers node tools/qdrant-sync.mjs --search "propuesta de valor"
 *
 *   # Watch mode
 *   EMBEDDING_PROVIDER=transformers node tools/qdrant-sync.mjs --watch
 */

import { readFileSync, readdirSync, statSync, watch } from 'node:fs'
import { join, relative, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ─── Config ───────────────────────────────────────────────────────────────────

const CONFIG = {
  qdrantUrl: process.env.QDRANT_URL || 'http://localhost:6333',
  qdrantApiKey: process.env.QDRANT_API_KEY || null,
  collectionName: process.env.QDRANT_COLLECTION || 'obsidian-vault',
  embeddingProvider: process.env.EMBEDDING_PROVIDER || 'transformers',
  embeddingModel: process.env.EMBEDDING_MODEL || 'Xenova/all-MiniLM-L6-v2',
  openrouterUrl: 'https://openrouter.ai/api/v1',
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  chunkSize: 500,
  chunkOverlap: 50,
  debounceMs: 2000
}

// Vector sizes by model prefix
const VECTOR_SIZES = {
  'text-embedding-3-large': 3072,
  'text-embedding-3-small': 1536,
  'nomic-embed-text': 768,
  'mxbail-embed-large': 1024,
  'all-MiniLM-L6-v2': 384,
  'bge-small': 384,
  'bge-base': 768,
  'multilingual-e5-small': 384,
  'multilingual-e5-large': 1024,
  'gte-small': 384
}

function getVectorSize(model) {
  for (const [key, size] of Object.entries(VECTOR_SIZES)) {
    if (model.includes(key)) return size
  }
  return 384 // default: MiniLM
}

const EXCLUDE_DIRS = new Set([
  '.git', '.obsidian', '.opencode', '.atl', '.engram',
  'node_modules', 'tools', '__pycache__'
])

const EXCLUDE_FILES = new Set([
  '.gitignore', 'package.json', 'package-lock.json',
  'opencode.jsonc', 'AGENTS.md', 'Vault-Index.md'
])

// ─── Embedding providers ──────────────────────────────────────────────────────

// Cache del pipeline de transformers (se carga una sola vez)
let transformersPipeline = null

async function getTransformersPipeline() {
  if (transformersPipeline) return transformersPipeline

  try {
    const { pipeline } = await import('@huggingface/transformers')
    console.log(`   🧠 Cargando modelo "${CONFIG.embeddingModel}" (primera vez, descarga ~80MB)...`)
    transformersPipeline = await pipeline('feature-extraction', CONFIG.embeddingModel)
    console.log('   ✅ Modelo cargado.')
    return transformersPipeline
  } catch (e) {
    console.error(`⚠️  @huggingface/transformers no disponible: ${e.message}`)
    console.error('   Instalalo con: npm install @huggingface/transformers')
    console.error('   O usa otro provider: EMBEDDING_PROVIDER=ollama|openrouter|openai')
    process.exit(1)
  }
}

async function getEmbedding(text, provider, model) {
  switch (provider) {
    case 'transformers':
      return getTransformersEmbedding(text, model)
    case 'openai':
      return getOpenAIEmbedding(text, model)
    case 'openrouter':
      return getOpenRouterEmbedding(text, model)
    case 'ollama':
      return getOllamaEmbedding(text, model)
    default:
      throw new Error(`Provider desconocido: ${provider}. Usa: transformers | ollama | openrouter | openai`)
  }
}

// ─── Transformers.js (LOCAL, GRATIS) ──────────────────────────────────────────

async function getTransformersEmbedding(text) {
  const pipe = await getTransformersPipeline()
  const output = await pipe(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

// ─── Ollama (LOCAL, GRATIS) ───────────────────────────────────────────────────

async function getOllamaEmbedding(text, model) {
  const res = await fetch(`${CONFIG.ollamaUrl}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt: text })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Ollama fallo: ${res.status} ${err}`)
  }
  const data = await res.json()
  return data.embedding
}

// ─── OpenRouter (CLOUD, OpenAI-compatible) ─────────────────────────────────────

async function getOpenRouterEmbedding(text, model) {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error('OPENROUTER_API_KEY requerida. Conseguila en https://openrouter.ai/keys')

  const res = await fetch(`${CONFIG.openrouterUrl}/embeddings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/anomalyco/opencode',
      'X-Title': 'SOM-U Vault'
    },
    body: JSON.stringify({ model, input: text })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter fallo: ${res.status} ${err}`)
  }
  const data = await res.json()
  return data.data[0].embedding
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

async function getOpenAIEmbedding(text, model) {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY requerida')

  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input: text, model })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI fallo: ${res.status} ${err}`)
  }
  const data = await res.json()
  return data.data[0].embedding
}

// ─── Chunking ─────────────────────────────────────────────────────────────────

function chunkMarkdown(content, filePath) {
  const chunks = []
  const lines = content.split('\n')

  let fmEnd = 0
  let inFm = false
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (!inFm) { inFm = true; continue }
      else { fmEnd = i + 1; break }
    }
    if (inFm) continue
  }

  const body = lines.slice(fmEnd).join('\n')
  const sections = body.split(/\n(?=## )/)

  for (const section of sections) {
    const trimmed = section.trim()
    if (!trimmed) continue

    const words = trimmed.split(/\s+/).length
    if (words <= CONFIG.chunkSize) {
      chunks.push(trimmed)
    } else {
      const paragraphs = trimmed.split(/\n\n+/)
      let current = ''
      for (const para of paragraphs) {
        if ((current + '\n\n' + para).split(/\s+/).length > CONFIG.chunkSize && current) {
          chunks.push(current.trim())
          current = para
        } else {
          current = current ? current + '\n\n' + para : para
        }
      }
      if (current.trim()) chunks.push(current.trim())
    }
  }

  return chunks.map((text, i) => ({
    id: hashId(filePath, i),
    text,
    metadata: {
      file: relative(ROOT, filePath).replace(/\\/g, '/'),
      chunk: i,
      total: chunks.length,
      folder: basename(dirname(filePath))
    }
  }))
}

function hashId(filePath, index) {
  const relPath = relative(ROOT, filePath).replace(/\\/g, '/')
  const hash = createHash('sha256').update(`${relPath}#${index}`).digest('hex')
  // Qdrant acepta unsigned integer. 13 hex chars = 52 bits (safe in JS Number).
  return Number('0x' + hash.slice(0, 13))
}

// ─── File scanning ────────────────────────────────────────────────────────────

function scanVault(dir = ROOT) {
  const files = []
  try {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith('.') || EXCLUDE_DIRS.has(entry)) continue
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        files.push(...scanVault(fullPath))
      } else if (stat.isFile() && entry.endsWith('.md') && !EXCLUDE_FILES.has(entry)) {
        files.push(fullPath)
      }
    }
  } catch { /* skip */ }
  return files
}

// ─── Qdrant client ────────────────────────────────────────────────────────────

async function getQdrantClient() {
  try {
    const { QdrantClient } = await import('@qdrant/js-client-rest')
    return new QdrantClient({
      url: CONFIG.qdrantUrl,
      apiKey: CONFIG.qdrantApiKey || undefined
    })
  } catch {
    console.error('⚠️  @qdrant/js-client-rest no esta instalado.')
    console.error('   Ejecuta: npm install @qdrant/js-client-rest')
    process.exit(1)
  }
}

async function ensureCollection(client) {
  const vectorSize = getVectorSize(CONFIG.embeddingModel)
  try {
    await client.getCollection(CONFIG.collectionName)
    console.log(`📦 Coleccion "${CONFIG.collectionName}" encontrada (${vectorSize}-dim).`)
  } catch {
    console.log(`📦 Creando coleccion "${CONFIG.collectionName}" (${vectorSize}-dim)...`)
    await client.createCollection(CONFIG.collectionName, {
      vectors: { size: vectorSize, distance: 'Cosine' }
    })
    console.log('   ✅ Coleccion creada.')
  }
}

// ─── Sync operations ──────────────────────────────────────────────────────────

async function syncFile(client, filePath, batch = []) {
  const content = readFileSync(filePath, 'utf-8')
  if (content.length < 20) return batch

  const chunks = chunkMarkdown(content, filePath)

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk.text, CONFIG.embeddingProvider, CONFIG.embeddingModel)
    batch.push({
      id: chunk.id,
      vector: embedding,
      payload: {
        text: chunk.text,
        file: chunk.metadata.file,
        chunk: chunk.metadata.chunk,
        total_chunks: chunk.metadata.total,
        folder: chunk.metadata.folder
      }
    })

    if (batch.length >= 20) {
      await upsertBatch(client, batch)
      batch.length = 0
    }
  }

  return batch
}

async function upsertBatch(client, batch) {
  try {
    await client.upsert(CONFIG.collectionName, { points: batch })
  } catch (e) {
    console.error(`\n   ❌ Upsert fallo: ${e.message}`)
    // Mostrar detalle del primer punto para debug
    if (batch.length > 0) {
      const p = batch[0]
      console.error(`   id: ${p.id}, vector[0]: ${p.vector[0]}, payload size: ${JSON.stringify(p.payload).length}`)
    }
  }
}

async function fullSync() {
  console.log('🔄 Iniciando sync completo del vault con Qdrant...')
  console.log(`   Provider: ${CONFIG.embeddingProvider} | Modelo: ${CONFIG.embeddingModel}`)
  console.log(`   Qdrant: ${CONFIG.qdrantUrl}\n`)

  const client = await getQdrantClient()
  await ensureCollection(client)

  const files = scanVault()
  console.log(`📄 ${files.length} archivos .md encontrados.\n`)

  let batch = []
  let processed = 0
  let errors = 0

  for (const file of files) {
    const relPath = relative(ROOT, file)
    try {
      process.stdout.write(`   ⏳ ${relPath}... `)
      batch = await syncFile(client, file, batch)
      console.log('✅')
      processed++
    } catch (e) {
      console.log(`❌ ${e.message}`)
      errors++
    }
  }

  if (batch.length > 0) {
    await upsertBatch(client, batch)
  }

  console.log(`\n📊 Sync completo: ${processed} procesados, ${errors} errores.`)
}

// ─── Search ───────────────────────────────────────────────────────────────────

async function searchVault(query, limit = 5) {
  const client = await getQdrantClient()
  const embedding = await getEmbedding(query, CONFIG.embeddingProvider, CONFIG.embeddingModel)

  const result = await client.search(CONFIG.collectionName, {
    vector: embedding,
    limit,
    with_payload: true
  })

  console.log(`\n🔍 Resultados para: "${query}"\n`)
  for (const hit of result) {
    const p = hit.payload
    console.log(`📄 ${p.file} (chunk ${Number(p.chunk) + 1}/${p.total_chunks}) [score: ${hit.score.toFixed(3)}]`)
    console.log(`   ${p.text.slice(0, 200)}${p.text.length > 200 ? '...' : ''}`)
    console.log()
  }
}

// ─── Watch mode ────────────────────────────────────────────────────────────────

function watchVault() {
  console.log('👁️  Modo watch activado. Sincronizando cambios en tiempo real...')

  let timeout = null
  const schedule = (filePath) => {
    clearTimeout(timeout)
    timeout = setTimeout(async () => {
      console.log(`\n🔄 Cambio detectado: ${relative(ROOT, filePath)}`)
      const client = await getQdrantClient()
      await syncFile(client, filePath)
      console.log('   ✅ Sincronizado.')
    }, CONFIG.debounceMs)
  }

  watch(ROOT, { recursive: true }, (event, filename) => {
    if (!filename || !filename.endsWith('.md')) return
    if (filename.startsWith('.') || filename.includes('node_modules')) return
    if (EXCLUDE_FILES.has(basename(filename))) return
    schedule(join(ROOT, filename))
  })
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const mode = args[0]

if (mode === '--search' || mode === '-s') {
  const query = args.slice(1).join(' ')
  if (!query) {
    console.log('Uso: node tools/qdrant-sync.mjs --search "tu busqueda"')
    process.exit(1)
  }
  const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '5')
  await searchVault(query, limit)
} else if (mode === '--watch' || mode === '-w') {
  watchVault()
} else if (mode === '--help' || mode === '-h') {
  showHelp()
} else {
  await fullSync()
}

function showHelp() {
  console.log(`
qdrant-sync.mjs — Sync vault ↔ Qdrant con busqueda semantica

USO:
  node tools/qdrant-sync.mjs              # Sync completo
  node tools/qdrant-sync.mjs --search "q" # Buscar
  node tools/qdrant-sync.mjs --watch      # Watch mode

PROVIDERS (set EMBEDDING_PROVIDER):
  transformers   LOCAL, GRATIS — sin API key, sin servidor [default]
  ollama         LOCAL, GRATIS — requiere Ollama corriendo
  openrouter     CLOUD, BARATO — usa OPENROUTER_API_KEY
  openai         CLOUD — usa OPENAI_API_KEY

VARIABLES:
  QDRANT_URL            URL de Qdrant (default: http://localhost:6333)
  QDRANT_COLLECTION     Nombre de coleccion (default: obsidian-vault)
  EMBEDDING_PROVIDER    Provider (default: transformers)
  EMBEDDING_MODEL       Modelo especifico
  OPENROUTER_API_KEY    API key de OpenRouter
  OPENAI_API_KEY        API key de OpenAI
  OLLAMA_URL            URL de Ollama (default: http://localhost:11434)

EJEMPLOS:
  # Local con Transformers.js (recomendado)
  EMBEDDING_PROVIDER=transformers node tools/qdrant-sync.mjs

  # Local con Ollama
  ollama pull nomic-embed-text
  EMBEDDING_PROVIDER=ollama EMBEDDING_MODEL=nomic-embed-text node tools/qdrant-sync.mjs

  # Cloud con OpenRouter
  EMBEDDING_PROVIDER=openrouter OPENROUTER_API_KEY=sk-or-... node tools/qdrant-sync.mjs
`)
}
