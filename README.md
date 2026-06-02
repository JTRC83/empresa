# SOM-OS.dev Vault — Obsidian Knowledge Base

> Vault de estrategia de marca **SOM-OS.dev by Adrian Colom** con tooling de IA.

## Estructura

```
empresa/
├── AGENTS.md              ← Knowledge Manager (reglas para la IA)
├── Vault-Index.md          ← Indice global auto-generado
├── opencode.jsonc          ← Config de OpenCode
├── package.json            ← Scripts Node
├── graphify-out/           ← Knowledge graph (Graphify)
│   ├── GRAPH_REPORT.md     ← God nodes, comunidades, conexiones
│   ├── graph.json          ← Grafo completo (NetworkX)
│   └── graph.html          ← Visualizacion interactiva
├── tools/
│   └── generate-index.mjs  ← Genera index.md por carpeta
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

# 4. Regenerar knowledge graph (requiere Python + graphify)
#    Ver graphify-out/GRAPH_REPORT.md para el grafo actual
pip install graphifyy
python graphify-out/vault_extract.py
python graphify-out/vault_build.py
```

## Comandos

| Comando | Que hace |
|---------|----------|
| `npm run index` | Regenera todos los index.md |

## Knowledge Graph (Graphify)

El vault tiene un **knowledge graph** generado con Graphify en `graphify-out/`:
- **128 nodos, 355 edges, 12 comunidades**
- **God nodes**: `index`, `Conceptos`, `Foundation`, `Atenfy`, `Propuesta de Valor`...
- Abri `graphify-out/graph.html` en el browser para visualizacion interactiva
- El Knowledge Manager usa `GRAPH_REPORT.md` como punto de entrada

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
2. **Usar Graphify** como primer paso (god nodes, comunidades)
3. **Crear conocimiento** siguiendo convenciones (frontmatter, wikilinks)
4. **Investigar** con fuentes externas y sintetizar en notas nuevas

OpenCode lo carga automaticamente via `"instructions": ["AGENTS.md"]` en opencode.jsonc.

### Agent profile

`.opencode/agents/knowledge-manager.md` — perfil de agente dedicado.
Invocable como sub-agente: `@knowledge-manager investiga el concepto central`

## Dependencias

```json
{
  "node": ">=18"
}
```

## Graphify

El vault usa **Graphify** como knowledge graph. Se genera manualmente cuando cambia la estructura:

```bash
# Instalar (una vez)
pip install graphifyy

# Extraer wikilinks + frontmatter
python graphify-out/vault_extract.py

# Build + cluster + report
python graphify-out/vault_build.py
```

Resultados en `graphify-out/`:
- `graph.json` — grafo completo (NetworkX node-link)
- `graph.html` — visualizacion interactiva (abrir en browser)
- `GRAPH_REPORT.md` — god nodes, comunidades, conexiones sorprendentes

## Requisitos

- Node >= 18
- Python >= 3.10 (para Graphify)
- Obsidian (para editar el vault)
- Git (pre-commit hook automatico)
