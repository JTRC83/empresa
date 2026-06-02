# Graph Report - C:\proyectos\empresa  (2026-06-02)

## Corpus Check
- 98 files · ~100,871 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 128 nodes · 355 edges · 12 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_00 - Meta  01 - Diagnóstico y Evaluación|00 - Meta / 01 - Diagnóstico y Evaluación]]
- [[_COMMUNITY_Conceptos|Conceptos]]
- [[_COMMUNITY_chunkMarkdown()|chunkMarkdown()]]
- [[_COMMUNITY_buildTree()|buildTree()]]
- [[_COMMUNITY_06 - Proyectos|06 - Proyectos]]
- [[_COMMUNITY_Modulos|Modulos]]
- [[_COMMUNITY_07 - Informacion Publica|07 - Informacion Publica]]
- [[_COMMUNITY_Extensiones|Extensiones]]
- [[_COMMUNITY_Foundation|Foundation]]
- [[_COMMUNITY_AGENTS|AGENTS]]
- [[_COMMUNITY_README|README]]
- [[_COMMUNITY_Vault-Index|Vault-Index]]

## God Nodes (most connected - your core abstractions)
1. `index` - 74 edges
2. `Conceptos` - 26 edges
3. `Índice Documentos Marca` - 21 edges
4. `Concepto Central - De aislado a conectado` - 15 edges
5. `Atenfy` - 14 edges
6. `Foundation` - 14 edges
7. `Naming - SOM OS` - 14 edges
8. `Propuesta de Valor - Sistemas operativos empresariales` - 13 edges
9. `Plan de Empresa - Ecosistema SOM-OS` - 12 edges
10. `CanvasAPI` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Índice Documentos Marca` --in_folder--> `00 - Meta`  [EXTRACTED]
  00 - Meta\Índice Documentos Marca.md → 00 - Meta\index.md
- `Prompt Web — SOM-OS.dev` --in_folder--> `Conceptos`  [EXTRACTED]
  Conceptos\Prompt Web - SOM-OS.dev.md → Conceptos\ADN - Tecnología-Tierra.md
- `index` --wikilink--> `Índice Documentos Marca`  [EXTRACTED]
  00 - Meta\index.md → 00 - Meta\Índice Documentos Marca.md
- `index` --wikilink--> `Sesión de Valoración - Retrato del Negocio`  [EXTRACTED]
  00 - Meta\index.md → 01 - Diagnóstico y Evaluación\Sesion_valoracion_0005.md
- `index` --in_folder--> `01 - Diagnóstico y Evaluación`  [EXTRACTED]
  00 - Meta\index.md → 01 - Diagnóstico y Evaluación\index.md

## Communities

### Community 0 - "00 - Meta / 01 - Diagnóstico y Evaluación"
Cohesion: 0.11
Nodes (30): ACTUALIZACIÓN _MARCA_0002 (1), BREAFING_MARCA_0002, Briefing de Marca - Duplicado (Archivo), Brief de Diseño — SOM-OS, Estilo Web — Profesional con alma artesanal, ESTRATEGIA CREATIVA_ACTUALIZADA_0002, 00 - Meta, 01 - Diagnóstico y Evaluación (+22 more)

### Community 1 - "Conceptos"
Cohesion: 0.41
Nodes (22): ADN - Tecnología-Tierra, Arquetipo de Marca - El Arquitecto, Concepto Central Actualizado - De componentes aislados a sistemas operativos inteligentes, Concepto Central - De aislado a conectado, Diferenciación - Inventor vs Técnico, Conceptos, Hito Narrativo - La noche de la pizarra 5 junio 2025, Insight de Origen - Tecnología como refugio (+14 more)

### Community 2 - "chunkMarkdown()"
Cohesion: 0.2
Nodes (15): chunkMarkdown(), ensureCollection(), fullSync(), getEmbedding(), getOllamaEmbedding(), getOpenAIEmbedding(), getOpenRouterEmbedding(), getQdrantClient() (+7 more)

### Community 3 - "buildTree()"
Cohesion: 0.29
Nodes (12): buildTree(), collectFiles(), extractFirstParagraph(), extractFrontmatter(), generateDirIndex(), generateVaultIndex(), getContentDirs(), getDescription() (+4 more)

### Community 4 - "06 - Proyectos"
Cohesion: 0.63
Nodes (14): Atenfy, CanvasAPI, CommitWear, Comparativa - Foundation vs TanStack Start, 06 - Proyectos, Foundation, GenLegalTxts, Plan de Empresa - Ecosistema SOM-OS (+6 more)

### Community 5 - "Modulos"
Cohesion: 0.22
Nodes (9): Billing — Facturación, Communications — Comunicaciones y Email, Error Tracker — Monitoreo de Errores, Modulos, IAM — Identity & Access Management, Storage — Sistema de Archivos, Translations — Internacionalización, UI App — Toolkit de Componentes (+1 more)

### Community 6 - "07 - Informacion Publica"
Cohesion: 0.93
Nodes (6): 07 - Informacion Publica, Ikirai Solutions - Agencia de IA, Joan Toni Ramon Crespi - Socio, Perfil Publico - Adrian Colom Palacios, Presencia Digital - Redes y plataformas, Proyectos Publicos - URLs y estado

### Community 7 - "Extensiones"
Cohesion: 0.4
Nodes (5): CMS — Content Management System, Extensiones, Landing — Páginas Públicas, Sistema de Extensiones — Foundation, Stripe — Integración de Pagos

### Community 8 - "Foundation"
Cohesion: 0.5
Nodes (4): Búsqueda Semántica — Qdrant + Graphify, Core — Sistema de Núcleo, Foundation, Infraestructura — Base de Datos y Utilidades

### Community 11 - "AGENTS"
Cohesion: 1.0
Nodes (1): AGENTS

### Community 12 - "README"
Cohesion: 1.0
Nodes (1): README

### Community 13 - "Vault-Index"
Cohesion: 1.0
Nodes (1): Vault-Index

## Knowledge Gaps
- **19 isolated node(s):** `AGENTS`, `README`, `Vault-Index`, `Búsqueda Semántica — Qdrant + Graphify`, `Core — Sistema de Núcleo` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `AGENTS`** (1 nodes): `AGENTS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `README`** (1 nodes): `README`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vault-Index`** (1 nodes): `Vault-Index`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index` connect `00 - Meta / 01 - Diagnóstico y Evaluación` to `Conceptos`, `06 - Proyectos`, `Modulos`, `07 - Informacion Publica`, `Extensiones`, `Foundation`?**
  _High betweenness centrality (0.422) - this node is a cross-community bridge._
- **Why does `Modulos` connect `Modulos` to `00 - Meta / 01 - Diagnóstico y Evaluación`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `Extensiones` connect `Extensiones` to `00 - Meta / 01 - Diagnóstico y Evaluación`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `AGENTS`, `README`, `Vault-Index` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `00 - Meta / 01 - Diagnóstico y Evaluación` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._