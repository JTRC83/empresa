---
title: "Foundation"
tags:
  - proyecto
  - producto
  - plantilla
  - monorepo
  - nestjs
  - nuxt
  - saas
  - infraestructura
  - backend
  - frontend
  - arquitectura-limpia
  - hexagonal
  - typeorm
  - postgresql
  - som-u
  - ecosistema
category: proyecto
url: ""
code_path: "C:\\proyectos\\foundation"
status: activo
---

# Foundation

> [!info] Visión general
> Foundation es una **plantilla modular SaaS** construida como monorepo Turborepo. Es la base técnica sobre la que se construyen los proyectos del ecosistema SOM-U. Incluye backend (NestJS + TypeORM + PostgreSQL), frontend (Nuxt 3 + Vue 3), autenticación, billing, CMS, sistema de extensiones auto-descubribles, y búsqueda semántica de código vía MCP Vector Search.

## Stack Tecnológico

### Monorepo & Build
| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| Node.js | >=18 (Docker: 22.16.0) | Runtime |
| pnpm | 9.0.0 | Package manager |
| Turborepo | 2.8.6 | Task runner del monorepo |
| TypeScript | 5.9.2 | Lenguaje |

### Backend (`apps/back/`)
| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| NestJS | 11.1.2 | Framework backend |
| TypeORM | 0.3.24 | ORM |
| PostgreSQL | 17.4 | Base de datos |
| Redis | 7-alpine | Cache / BullMQ |
| Passport + JWT | 0.7.0 / 4.0.1 | Autenticación |
| bcryptjs | 3.0.2 | Hash de passwords |
| Nodemailer | 6.10.1 | SMTP |
| BullMQ | 5.68.0 | Colas de email |
| Stripe | 18.4.0 | Pagos |
| AWS SDK S3 | 3.758.0 | File storage |
| Swagger | 11.1.4 | Documentación API |
| Zod | 3.25.76 | Validación |
| Jest | 29.7.0 | Testing |
| Hygen | 6.2.11 | Generadores de código |
| Maizzle | 5.0.8 | Templates de email (Tailwind) |

### Frontend (`apps/front/`)
| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| Nuxt | 4.3.1 | Framework frontend |
| Vue | 3.5.13 | UI library |
| Tailwind CSS | 4.1.3 | Estilos |
| DaisyUI | 5.5.19 | Component library |
| Pinia | 3.0.4 | State management |
| TanStack Vue Table | 8.21.3 | Data tables |
| TipTap | 3.20.1 | Rich text editor |
| Vee-Validate + Zod | 4.15.0 | Formularios |
| @nuxtjs/i18n | 10.2.3 | Internacionalización |
| @vueuse/core | 13.9.0 | Composables |

### MCP Vector Search (`mcp-engine/`)
| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| @modelcontextprotocol/sdk | 1.0.0 | Protocolo MCP |
| @qdrant/js-client-rest | 1.9.0 | Vector DB |
| openai | 4.0.0 | Embeddings API |

## Arquitectura Backend

### Estructura de directorios
```
apps/back/src/
├── main.ts                 # Bootstrap (Swagger, pipes, filters, CORS)
├── app.module.ts           # Root module
├── config/                 # Configs (app, worker, database, auth, mail, file, stripe)
├── core/
│   ├── infrastructure.module.ts   # DB, Config, i18n, static files
│   ├── foundation.module.ts       # Todos los feature modules
│   ├── extension-loader.ts        # Auto-discovery de extensions/
│   ├── seed-loader.ts
│   └── config-loader.ts
├── infrastructure/
│   ├── database/           # TypeORM config, migraciones, seeds
│   ├── mailer/             # Nodemailer wrapper
│   └── utils/              # Utilidades compartidas
├── modules/                # Módulos de negocio
│   ├── iam/                # Identity & Access Management
│   ├── users/              # Usuarios + Estados
│   ├── communications/     # Mail + Email Queue + Home
│   ├── storage/            # File storage (local/S3)
│   ├── billing/            # Stripe integration
│   ├── cms/                # Páginas, Blog, Categorías, SEO, Sitemap
│   ├── translations/       # i18n DB + CLI tools
│   ├── error-tracker/      # Error logging + Telegram
│   └── social/             # Social auth
├── extensions/             # Extensiones drop-in (auto-discovered)
└── i18n/                   # JSON translation files
```

### Sistema de Módulos
- **`InfrastructureModule`** — Carga una vez. Provee: TypeORM, ConfigModule, i18n, ServeStatic, ScheduleModule.
- **`FoundationModule`** — Agrupa todos los módulos de negocio. Es donde se agregan/quitan features.
- **Domain-Driven Design** — Cada módulo tiene: `domain/`, `dto/`, `infrastructure/` (entities, mappers, repositories), controller, service.

### Autenticación y Autorización
- **JWT Strategy** — Bearer token. Adjunta `req.user` con `id`, `sessionId`, `role`.
- **API Key Strategy** — Header `X-API-Key`. Keys almacenadas hasheadas. Una key por usuario.
- **Session-based** — Cada login crea `SessionEntity` con hash SHA256. Refresh tokens vinculados a sesiones.
- **Decoradores:**
  - `@JwtAuth()` — Solo JWT
  - `@ApiKeyAuth()` — Solo API key
  - `@FlexibleAuth()` — JWT o API key
  - `@OptionalAuth()` — Anónimo permitido
  - `@AdminAuth()` / `@CustomerAuth()` — Rol + JWT
- **RBAC** — Roles: `admin` (id: 1), `customer` (id: 2). `RolesGuard` verifica `req.user.role.id`.
- **Ownership pattern** — `assertOwnerOrAdmin()`. Admin ve todo; customer ve lo propio.

### Billing
- Integración **Stripe** bajo `modules/billing/stripe/`. `stripeCustomerId` en `UserEntity`.

### Storage (Archivos)
- **Attachments polimórficas** vía `FileEntity` con `entityName` + `entityId`.
- **Drivers:** Local (`./files/public|private`) o S3 (con presigned URLs).
- **Auto-cleanup:** `GlobalFileCleanupSubscriber` escucha `beforeRemove`, encuentra archivos vinculados, los elimina.
- **Importante:** Usar `.remove()` — `.delete()` o QueryBuilder bypassan subscribers.

### Comunicaciones y Email
- **MailerService** — Nodemailer low-level.
- **MailService** — High-level (userSignUp, forgotPassword, confirmNewEmail).
- **EmailQueueModule** — BullMQ + Redis para delivery async. Fallback a sync si Redis no disponible.
- **Maizzle templates** — Tailwind CSS para email. Source en `mail-templates/emails/`, compilado a `build/*.hbs`.

### Error Tracking
- **GlobalExceptionFilter** — Captura errores HTTP 500+.
- **Process listeners** — `unhandledRejection`, `uncaughtException`.
- **Deduplicación** — Hash SHA256 de message + source + stack (primeros 200 chars). Incrementa `occurrences`.
- **Telegram notifier** — Opcional. Notifica errores nuevos y cada 5/10 ocurrencias.
- **Frontend plugin** — `error-handler.client.ts` captura errores Vue, unhandled rejections, global errors.

### CMS Module
- **Páginas** — Templates landing/generic/contact, SEO metadata, traducciones.
- **Blog** — Posts + Categorías. Editor TipTap. Workflow draft/publish.
- **Media upload** — `POST /cms/media/upload` con entity linking.
- **Dynamic translations** — `GET /translations/dynamic/:lang/:entityName/:entityId`.

## Arquitectura Frontend

### Sistema de Layers (Nuxt 3)
```
apps/front/
├── nuxt.config.ts              # App principal — extiende todos los layers
├── layouts/
│   ├── default.vue             # Sidebar + header (auth)
│   └── blank.vue               # Login/register
├── modules/
│   ├── landing/                # Páginas públicas
│   ├── base/                   # Auth, UI components, translations
│   │   ├── auth/               # Login, register, stores, middleware
│   │   ├── ui-app/             # DataTable, Form components, rich-editor
│   │   ├── translations/       # Admin translation UI
│   │   └── error-tracker/      # Error dashboard
│   └── cms/                    # CMS admin + public blog pages
└── locales/                    # JSON i18n
```

### Auth System
- **`useAuthStore`** (Pinia, persisted) — `token`, `refreshToken`, `tokenExpires`, `user`.
- **Auto-refresh** — `setTimeout` refresca token 1 minuto antes de expirar.
- **fetchWrapper** — Adjunta automáticamente `Authorization: Bearer`. Maneja 401 con token refresh queue.
- **Middleware:**
  - `admin.global.ts` — Protege `/app/*`. Redirige a login si no auth, 403 si no admin.
  - `auth.ts` — Middleware nombrado para rutas autenticadas.
  - `guest.ts` — Redirige usuarios auth lejos de páginas públicas.

### UI Components
- **DataTable** — Wrapper de TanStack Table. Server-side sorting, filtering, pagination.
- **Form components** — `FormInput`, `FormSelect`, `FormDate`, `FormTextArea`, `FormFile`. Built on vee-validate + Zod.
- **RichEditor** — TipTap v3 con StarterKit, Link, Image, Highlight, TextAlign, Typography, Table.

### Dynamic i18n
- **Idiomas cargados desde DB al startup** — `nuxt.config.ts` hook `i18n:registerModule`.
- **Fallback** a `[es, en]` si backend no disponible.
- **Dev mode toggle** — Botón flotante expone raw translation keys inline. Edición modal multilenguaje.

## Base de Datos (TypeORM)

### Configuración
- TypeORM 0.3.24 con `typeorm-config.service.ts`.
- **Entities glob:** `__dirname + '/../../**/*.entity{.ts,.js}'` — descubre módulos Y extensiones.
- **Migrations:** `src/infrastructure/database/migrations/`.

### Entidades Clave
| Entidad | Campos Clave | Notas |
|---------|--------------|-------|
| **UserEntity** | `id`, `email`, `password`, `provider`, `socialId`, `firstName`, `lastName`, `stripeCustomerId`, `role`, `status` | Soft delete |
| **RoleEntity** | `id`, `name` | IDs estáticos: 1=admin, 2=customer |
| **SessionEntity** | `id`, `user`, `hash`, `createdAt`, `updatedAt`, `deletedAt` | Refresh token rotation |
| **FileEntity** | `id` (UUID), `path`, `name`, `isPublic`, `entityName`, `entityId` | Attachments polimórficos |
| **TranslationEntity** | `id`, `app`, `section`, `key`, `content`, `lang`, `entityName`, `entityId` | Traducciones estáticas + dinámicas |
| **LangEntity** | `code`, `name`, `isActive`, `flagCode` | Cargados dinámicamente por frontend |

## Sistema de Extensiones

### Cómo funciona
- **Meta:** Copiar-pegar backend features como Nuxt Layers.
- **Ubicación:** `apps/back/src/extensions/<nombre>/`
- **Convención:** Debe contener `extension.module.ts`.
- **Auto-discovery:** `ExtensionLoaderModule.register()` escanea `extensions/` al startup.
- **Entity discovery:** Ya funciona vía TypeORM glob.
- **Config discovery:** `discoverExtensionConfigs()` encuentra `extension.config.ts`.
- **Seed discovery:** `ExtensionSeedLoaderModule` encuentra `*-seed.module.ts`.

### Estado actual
- ✅ Infraestructura implementada (`extension-loader.ts`, `config-loader.ts`, `seed-loader.ts`).
- ⚠️ Carpeta `extensions/` está **vacía**. Todas las features viven en `modules/`.
- **Generadores:** `pnpm generate:extension` scaffold directo a `extensions/`.

## MCP Vector Search

### Arquitectura
```
Código fuente → indexer.ts → parser/ → Qdrant (vector DB)
                                       ↑
Cliente OpenCode AI ← MCP server.ts ← search/ (hybrid: vector + BM25)
```

### Componentes
| Componente | Archivo | Propósito |
|------------|---------|-----------|
| **CLI** | `mcp-engine/src/cli.ts` | Index, re-index, delete, list |
| **Indexer** | `mcp-engine/src/indexer.ts` | Crea engrams desde código |
| **Parser** | `mcp-engine/src/parser/` | Extracción de metadata TS, Vue, Markdown |
| **Search** | `mcp-engine/src/search/` | `hybrid.ts` (vector + BM25) |
| **Server** | `mcp-engine/src/server.ts` | MCP server expone tools a OpenCode |

### Engrams
- **Chunking:** Max 150 líneas por chunk. Archivos ≤400 líneas = single engram.
- **Metadata:** `filePath`, `lineStart/End`, `imports`, `exports`, `framework`, `keywords`.
- **Embeddings:** 4096 dims vía `qwen/qwen3-embedding-8b` through OpenRouter.
- **Hybrid search:** `score = 0.7 * vector_similarity + 0.3 * BM25`.

### Setup
```bash
cd mcp-engine && docker-compose up -d  # Qdrant
npx tsx mcp-engine/src/cli.ts index     # Indexar proyecto
```

## Docker

### `docker-compose.yml` (Root)
| Servicio | Imagen | Puertos |
|----------|--------|---------|
| **postgres** | `postgres:17.4-alpine` | 5432 |
| **redis** | `redis:7-alpine` | 6379 |
| **mailpit** | `axllent/mailpit` | 8025 (UI), 1025 (SMTP) |
| **backend** | Custom Dockerfile | 3001 |
| **frontend** | Custom Dockerfile | 3000 |

### Backend Dockerfile
- Base: `node:22.16.0-alpine`
- Build at image creation time
- Entry: `/opt/startup.sh`

### Frontend Dockerfile
- Multi-stage build
- Stage 1: build con pnpm
- Stage 2: copia `.output/`, ejecuta `node .output/server/index.mjs`

## Workflow de Desarrollo

### Scripts (Root)
```bash
pnpm dev          # Turbo corre ambas apps
pnpm build        # Turbo build
pnpm lint         # Turbo lint
pnpm check-types  # Turbo type check
```

### Backend Scripts
```bash
pnpm dev                          # nest start --watch
pnpm migration:generate <name>    # Auto-diff migration
pnpm migration:run                # Run migrations
pnpm seed:run                     # Run seeds
pnpm generate:resource            # Hygen CRUD module
pnpm generate:extension           # Hygen extension module
pnpm add:property                 # Agregar campo a recurso existente
pnpm translation:add              # CLI interactivo para traducciones
pnpm maizzle:build                # Compilar email templates
pnpm test                         # Jest
```

## Hallazgos y Estado

- ✅ Monorepo bien estructurado con separación clara de concerns
- ✅ DDD en backend, Nuxt Layers en frontend
- ✅ Sistema de extensiones listo pero no aprovechado
- ⚠️ Carpeta `extensions/` vacía — todas las features en `modules/`
- ⚠️ No hay directorio `packages/` a pesar de estar en workspace

## Relaciones

- Es la **base técnica** sobre la que se construyen otros proyectos del ecosistema SOM-U
- [[Atenfy]] — podría construirse sobre Foundation (NestJS + Nuxt + auth + billing)
- [[CanvasAPI]] — podría usar Foundation como base
- [[GenLegalTxts]] — podría usar Foundation como base
