# SOM-U Vault — Obsidian Knowledge Base

> Vault de estrategia de marca **SOM-U by Adrian Colom** con tooling de IA.

## Estructura

```
empresa/
├── AGENTS.md              ← Knowledge Manager (reglas para la IA)
├── Vault-Index.md          ← Indice global auto-generado
├── opencode.jsonc          ← Config de OpenCode (+ Qdrant MCP)
├── package.json            ← Dependencias Node
├── tools/
│   ├── generate-index.mjs  ← Genera index.md por carpeta
│   └── qdrant-sync.mjs     ← Sync vault ↔ Qdrant
├── 00 - Meta/              ← Indices, mapas, metadata
├── 01 - Diagnostico/       ← Retrato del negocio
├── 02 - Proceso Creativo/  ← 7 dias de introspeccion
├── 03 - Estrategia/        ← Briefing, concepto, propuesta
├── 04 - Naming y Tagline/  ← Exploracion del naming
├── 05 - Arquitectura/      ← Producto y metodologia
├── 06 - Proyectos/         ← CommitWear, CanvasAPI, etc.
├── 99 - Archivo/           ← Versiones anteriores
└── Conceptos/              ← Notas atomicas
```

Cada carpeta tiene un `index.md` auto-generado con arbol, descripciones y tags.

## Setup rapido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar API keys (crea .env desde .env.template)
#    TAVILY_API_KEY=...  (busqueda web)
#    OPENROUTER_API_KEY=... (opcional, LLM alternativo)

# 3. Arrancar (carga .env automaticamente)
node start.mjs

# 4. Levantar Qdrant (busqueda semantica)
docker compose up -d

# 5. Sync del vault a Qdrant (local, gratis, sin API key)
EMBEDDING_PROVIDER=transformers node tools/qdrant-sync.mjs
```

## Comandos

| Comando | Que hace |
|---------|----------|
| `npm run index` | Regenera todos los index.md |
| `npm run qdrant-sync` | Sincroniza vault con Qdrant |
| `npm run qdrant-search` | Busqueda semantica (requiere query) |
| `npm run qdrant-watch` | Watch mode: sync en tiempo real |

## Busqueda semantica

```bash
# Buscar en el vault
EMBEDDING_PROVIDER=transformers node tools/qdrant-sync.mjs --search "propuesta de valor"

# Con mas resultados
EMBEDDING_PROVIDER=transformers node tools/qdrant-sync.mjs --search "concepto central" --limit=10
```

## Embedding providers

El sync soporta 4 providers. Elegi uno con `EMBEDDING_PROVIDER`:

| Provider | Donde corre | Costo | Requiere |
|----------|------------|-------|----------|
| `transformers` | Local | **Gratis** | `npm install` (una vez) |
| `ollama` | Local | Gratis | `ollama pull nomic-embed-text` |
| `openrouter` | Cloud | ~$0.0004/sync | `OPENROUTER_API_KEY` |
| `openai` | Cloud | Estandar | `OPENAI_API_KEY` |

### Ejemplos

```bash
# Transformers.js (recomendado)
EMBEDDING_PROVIDER=transformers npm run qdrant-sync

# Ollama
ollama pull nomic-embed-text
EMBEDDING_PROVIDER=ollama EMBEDDING_MODEL=nomic-embed-text npm run qdrant-sync

# OpenRouter
EMBEDDING_PROVIDER=openrouter OPENROUTER_API_KEY=sk-or-... npm run qdrant-sync
```

## Indices automaticos

Cada commit dispara `tools/generate-index.mjs` via pre-commit hook.
Esto genera:

- `Vault-Index.md` — mapa global del vault (~76 lineas, ~250 tokens)
- `carpeta/index.md` — detalle por carpeta con descripciones y tags

### Token efficiency

```
Antes: IA lee 36 archivos (~36K tokens) para entender el vault
Ahora: IA lee Vault-Index.md → index.md de carpeta → solo archivos necesarios
        Reduccion: 80-95% menos tokens
```

Para regenerar manualmente: `npm run index`

## AGENTS.md

Define al **Knowledge Manager** del vault. Reglas clave:

1. **NUNCA leer archivos sin antes leer indices** (token efficiency)
2. **Usar Qdrant** como primer paso de busqueda
3. **Crear conocimiento** siguiendo convenciones (frontmatter, wikilinks)
4. **Investigar** con fuentes externas y sintetizar en notas nuevas

OpenCode lo carga automaticamente via `"instructions": ["AGENTS.md"]` en opencode.jsonc.

### Agent profile

`.opencode/agents/knowledge-manager.md` — perfil de agente dedicado.
Invocable como sub-agente: `@knowledge-manager investiga el concepto central`

## Dependencias

```json
{
  "@huggingface/transformers": ">=3",   // embeddings locales (transformers)
  "@qdrant/js-client-rest": ">=1.13"   // cliente Qdrant
}
```

## Docker / Qdrant

El vault usa Qdrant como motor de busqueda semantica. Se levanta con Docker Compose:

```bash
# Arrancar (primera vez descarga la imagen)
docker compose up -d

# Ver logs
docker compose logs -f

# Frenar
docker compose stop

# Tirar todo y empezar de cero
docker compose down -v
```

El `docker-compose.yml` incluye:

- Puerto `6333` (REST API) — para el sync y busqueda
- Puerto `6334` (gRPC) — por si se necesita en el futuro
- Volumen persistente `qdrant_data` — los embeddings sobreviven reinicios
- `restart: unless-stopped` — se levanta solo con Docker

Puertos por defecto (cambiables en `docker-compose.yml` y `QDRANT_URL`):

| Variable | Default | Que es |
|----------|---------|--------|
| `QDRANT_URL` | `http://localhost:6333` | Endpoint REST de Qdrant |
| `QDRANT_COLLECTION` | `obsidian-vault` | Nombre de coleccion |

## Requisitos

- Node >= 18
- Docker (para Qdrant)
- Obsidian (para editar el vault)
- Git (pre-commit hook automatico)
