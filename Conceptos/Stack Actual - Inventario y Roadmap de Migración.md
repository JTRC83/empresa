---
title: "Stack Actual — Inventario y Roadmap de Migración"
date: 2026-06-01
tags:
  - stack
  - inventario
  - migracion
  - roadmap
  - fundacion
  - deuda-tecnica
  - arquitectura
description: "Inventario completo de cada herramienta en Foundation con análisis de riesgo, recomendación de migración, y timeline. Clasificación: mantener, migrar pronto, migrar a largo plazo, reemplazar ya."
---

# Stack Actual — Inventario y Roadmap de Migración

> [!info] Metodología
> Cada herramienta se evalúa en 4 dimensiones:
> - **Riesgo**: ¿puede volverse legacy/obsoleta en 2-3 años?
> - **Comunidad**: ¿crece, se estanca o muere?
> - **Alternativa**: ¿hay algo claramente mejor HOY?
> - **Costo de migración**: ¿bajo, medio, alto?

---

## 1. Monorepo & Build Tools

| Herramienta | Versión | Riesgo | Comunidad | Alternativa | Decisión | Timeline |
|-------------|---------|--------|-----------|-------------|----------|----------|
| **Node.js** | >=18 (Docker: 22.16.0) | 🟢 Bajo | Dominante | Deno, Bun | **Mantener** | Upgrade a LTS cada año |
| **pnpm** | 9.0.0 | 🟢 Bajo | Crece fuerte | npm, yarn | **Mantener** | Upgrade semestral |
| **Turborepo** | 2.8.6 | 🟢 Bajo | Estable (Vercel) | Nx, Lerna, Rush | **Mantener** | Evaluar Nx en 2028 si Turborepo se estanca |
| **TypeScript** | 5.9.2 | 🟢 Bajo | Dominante | Ninguno real | **Mantener** | Upgrade agresivo (cada minor) |

**Por qué**: Node y TypeScript son el estándar indiscutido. pnpm es el mejor package manager para monorepos (strict, rápido, sin hoisting problems). Turborepo tiene a Vercel atrás y es sólido. Nx es más pesado y opinado — Turborepo es suficiente para Foundation.

---

## 2. Backend — Core Framework

| Herramienta | Versión | Riesgo | Comunidad | Alternativa | Decisión | Timeline |
|-------------|---------|--------|-----------|-------------|----------|----------|
| **NestJS** | 11.1.2 | 🟡 Medio | Estable, nicho | Fastify, Hono, Express | **Mantener (corto plazo)** | Re-evaluar en 2027-2028 |

### Análisis profundo: NestJS

**Fortalezas:**
- Arquitectura DDD que YA funciona en Foundation
- Decorators, DI, guards, interceptors — battle-tested
- El sistema de módulos de NestJS mapea 1:1 con la arquitectura de Foundation
- Tipado end-to-end (con swagger/OpenAPI)

**Debilidades:**
- Pesado para cold starts (~2-5MB bundle, DI container overhead)
- La comunidad no crece al ritmo de Fastify o Hono
- El boilerplate de módulos/controllers/services es verboso comparado con server functions
- No es serverless-friendly (aunque se puede)

**¿Hacia dónde migrar en 2027-2028?**

| Alternativa | Pros | Contras | Fit con Foundation |
|-------------|------|---------|-------------------|
| **Fastify + tRPC** | 2x más rápido que NestJS, plugin system, tRPC da RPC type-safe | Sin DI nativo, sin guards/interceptors built-in. Hay que armar la arquitectura | Medio — Patrones DDD se mantienen, pero hay que reconstruir la infraestructura (guards, pipes) |
| **Hono + tRPC** | Ultra-liviano (14KB), serverless-first, runtime-agnostic | Muy nuevo, ecosistema mínimo, sin patrones establecidos para apps grandes | Bajo — Demasiado lightweight para la complejidad de Foundation |
| **Quedarse en NestJS** | Cero costo de migración | Riesgo de legacy a largo plazo | Máximo — Ya está |
| **Elysia (Bun)** | Rendimiento extremo, type-safe | Solo Bun runtime, ecosistema inmaduro, riesgo de vendor lock-in | Muy bajo — No es viable hoy |

**Recomendación**: Seguí en NestJS 2-3 años más. En 2027-2028, evaluá un piloto con Fastify + tRPC para ver si la DX justifica la migración. Mientras tanto, podés agregar tRPC sobre NestJS para tener la DX de RPC sin cambiar nada.

---

## 3. Backend — ORM / Base de Datos

| Herramienta | Versión | Riesgo | Comunidad | Alternativa | Decisión | Timeline |
|-------------|---------|--------|-----------|-------------|----------|----------|
| **TypeORM** | 0.3.24 | 🔴 Alto | Estancada, mantenimiento mínimo | Drizzle ORM, Prisma | **Migrar a Drizzle** | 6-12 meses |
| **PostgreSQL** | 17.4 | 🟢 Bajo | Dominante en OSS | MySQL, SQLite | **Mantener** | Upgrade de versión |
| **Redis** | 7-alpine | 🟢 Bajo | Dominante | Valkey (Redis fork) | **Mantener** | Evaluar Valkey en 2027 |

### Análisis profundo: TypeORM → Drizzle

**Por qué migrar:**
- TypeORM tiene [~1700 issues abiertos en GitHub](https://github.com/typeorm/typeorm/issues), mantenimiento casi inexistente
- La comunidad migró masivamente a Drizzle (33k+ stars) y Prisma
- Drizzle es SQL-like: si sabés SQL, sabés Drizzle. Sin doble aprendizaje.
- 0 dependencias. Serverless-ready. Tipado perfecto.
- Schema en TypeScript → migraciones auto-generadas → `drizzle-kit push` para dev
- Soporta PostgreSQL nativo con todos los features (CTEs, window functions, RLS, etc.)
- Drizzle Studio: interfaz visual para explorar la DB (como Prisma Studio pero más rápido)

**Qué perdés al migrar de TypeORM:**
- Active Record pattern (TypeORM). Drizzle es más funcional, menos OOP.
- QueryBuilder de TypeORM (pero Drizzle tiene su propio query builder SQL-like)
- Decorators en entities (Drizzle usa funciones puras, lo cual es mejor en realidad)

**Costo de migración**: Medio-alto (tocás todas las entities y repositories). Pero:
- Las entidades de Foundation son 15. No es una DB de 200 tablas.
- La lógica de negocio en services NO se toca — solo cambia la capa de datos.
- Se puede hacer **progresivamente**: empezás por una entidad nueva con Drizzle, coexistís con TypeORM, migrás de a una.

**Estrategia de migración TypeORM → Drizzle:**
1. Instalar Drizzle + pg driver en el monorepo (convive con TypeORM)
2. Crear schema Drizzle para una entidad nueva (ej: extensión CRM)
3. Usar Drizzle en nuevos módulos/extensiones
4. Migrar entidades legacy una por una (empezando por las más simples: StatusEntity, LangEntity)
5. Cuando todas están migradas, eliminar TypeORM

---

## 4. Backend — Auth

| Herramienta | Versión | Riesgo | Comunidad | Alternativa | Decisión | Timeline |
|-------------|---------|--------|-----------|-------------|----------|----------|
| **Passport + JWT** | 0.7.0 / 4.0.1 | 🟡 Medio | Passport legacy, JWT estándar | Implementación propia, Better Auth, Lucia | **Re-evaluar** | 12-18 meses |
| **bcryptjs** | 3.0.2 | 🟢 Bajo | Estable | @node-rs/bcrypt, bcrypt nativo | **Migrar a @node-rs/bcrypt** | 0-3 meses |

### Análisis: Auth

El auth de Foundation es sólido pero complejo:
- 6 decoradores (`@JwtAuth`, `@ApiKeyAuth`, `@FlexibleAuth`, `@OptionalAuth`, `@AdminAuth`, `@CustomerAuth`)
- Session-based con hash SHA256 + refresh tokens
- Social auth separada (Google, Facebook, Apple)
- API Keys hasheadas

**No tocaría esto ahora.** Funciona, está probado, y es seguridad. Migrar auth es la migración más riesgosa. Lo que sí:

- **bcryptjs → @node-rs/bcrypt**: Cambio trivial (misma API, 3-5x más rápido porque es nativo en Rust). Bajo riesgo.
- **A futuro (2027+)**: Podés simplificar el auth con una implementación más moderna siguiendo los patrones de Lucia (sesiones basadas en tokens, no en cookies server-side). Pero esto es opcional, no urgente.

---

## 5. Backend — Infraestructura

| Herramienta | Versión | Decisión | Timeline |
|-------------|---------|----------|----------|
| **Nodemailer** | 6.10.1 | **Mantener** | Indefinido |
| **BullMQ** | 5.68.0 | **Mantener** | Indefinido |
| **Stripe** | 18.4.0 | **Mantener** | Indefinido |
| **AWS SDK S3** | 3.758.0 | **Mantener, evaluar R2** | 12-18 meses |
| **Zod** | 3.25.76 | **Mantener** | Indefinido |
| **Maizzle** | 5.0.8 | **Mantener, evaluar React Email** | 18-24 meses |

### Notas:
- **AWS S3 → Cloudflare R2**: R2 es S3-compatible y no cobra egress (tráfico de salida). Para proyectos con muchos archivos servidos (Atenfy, CanvasAPI), puede ahorrar bastante. Pero no es urgente — S3 funciona.
- **Maizzle**: Sigue siendo excelente para emails con Tailwind. React Email es más moderno pero es React-only. No justifica migrar salvo que quieras unificar stacks.
- **Zod**: Sigue siendo el rey de validación. No hay competidor serio aún.

---

## 6. Backend — Testing

| Herramienta | Versión | Riesgo | Alternativa | Decisión | Timeline |
|-------------|---------|--------|-------------|----------|----------|
| **Jest** | 29.7.0 | 🔴 Medio-alto | Vitest | **Migrar a Vitest** | 0-3 meses |

**Por qué Vitest sobre Jest:**
- Misma API (`describe`, `it`, `expect`). Migración casi transparente.
- 5-10x más rápido (usa esbuild/swc para transform, no babel)
- Native ESM support (Jest tiene problemas con ESM)
- Vite-native (Foundation ya usa Vite para el frontend Nuxt)
- Watch mode más rápido
- Mejor UI (Vitest UI)
- Compatible con los mismos matchers y mocks

**Costo de migración**: Bajo. `vitest` acepta tests de Jest out of the box. Solo cambiás el runner.

**Script de migración:**
```bash
pnpm add -D vitest @vitest/coverage-v8
# Renombrar jest.config.ts → vitest.config.ts con ajustes mínimos
# Cambiar scripts: "test": "vitest" en vez de "jest"
```

---

## 7. Backend — DevTools

| Herramienta | Versión | Decisión | Timeline |
|-------------|---------|----------|----------|
| **Swagger** | 11.1.4 | **Migrar a Scalar** | 6-12 meses |
| **Hygen** | 6.2.11 | **Mantener** | Indefinido |

**Swagger → Scalar**: Scalar es una UI de API docs moderna, open-source, compatible con OpenAPI/Swagger. Mejor UX, dark mode, client generators, más rápido. La migración es cambiar un paquete de UI — la spec de OpenAPI de NestJS se mantiene igual.

---

## 8. Frontend — Framework

| Herramienta | Versión | Riesgo | Comunidad | Alternativa | Decisión | Timeline |
|-------------|---------|--------|-----------|-------------|----------|----------|
| **Nuxt** | 4.3.1 | 🟢 Bajo | Estable, crece | Next.js, SvelteKit | **Mantener** | Indefinido |
| **Vue** | 3.5.13 | 🟢 Bajo | Estable | React, Svelte, Solid | **Mantener** | Indefinido |

**Por qué mantener Vue/Nuxt (y no migrar a React/Next):**
- State of JS 2025: Vue ~45% usage, estable por años, sin declive
- Nuxt 4 ya salió, el equipo es sólido
- 60+ componentes de Foundation están en Vue. Migrar a React sería reescribir todo el frontend.
- Vue 3 Composition API es excelente. La DX es comparable a React hooks.
- React tiene más mercado laboral, pero para SOM-OS.dev (Adrián construye), eso no es factor.
- El ecosistema Vue (Pinia, VueUse, Nuxt modules) es maduro y completo.

**El único argumento real para React**: La comunidad es más grande y los LLMs tienen más training data de React. Pero esto se está emparejando rápido. En 2 años va a ser indistinto.

---

## 9. Frontend — UI y Estilos

| Herramienta | Versión | Decisión | Timeline |
|-------------|---------|----------|----------|
| **Tailwind CSS** | 4.1.3 | **Mantener** | Indefinido |
| **DaisyUI** | 5.5.19 | **Re-evaluar (reducir o eliminar)** | 6-12 meses |
| **TanStack Vue Table** | 8.21.3 | **Mantener + upgrade** | Semestral |
| **TipTap** | 3.20.1 | **Mantener** | Indefinido |
| **Vee-Validate + Zod** | 4.15.0 | **Mantener** | Indefinido |
| **Pinia** | 3.0.4 | **Mantener** | Indefinido |
| **@vueuse/core** | 13.9.0 | **Mantener** | Indefinido |

### Análisis: DaisyUI

DaisyUI es útil pero:
- Tailwind v4 ya es MUY potente por sí solo. Muchos components de DaisyUI se pueden replicar con Tailwind puro en 2-3 clases.
- DaisyUI agrega ~80KB de CSS extra.
- Si algún día querés migrar a un design system más custom (como Radix-Vue o Reka UI para componentes headless), DaisyUI estorba.

**No es urgente sacarlo**, pero a medida que los componentes de Foundation evolucionan, tratá de no depender de clases DaisyUI nuevas. Usá Tailwind vanilla.

---

## 10. Frontend — i18n

| Herramienta | Versión | Decisión | Timeline |
|-------------|---------|----------|----------|
| **@nuxtjs/i18n** | 10.2.3 | **Mantener** | Indefinido |
| **DB-driven translations** | (propio) | **Expandir** | Continuo |

El sistema de traducciones de Foundation es híbrido: i18n de Nuxt para UI estática + DB para traducciones dinámicas. Esto es correcto y no necesita cambio. De hecho, el `TranslationDevToggle` y el editor inline son una ventaja competitiva. Seguí iterando sobre eso.

---

## 11. MCP Vector Search

| Herramienta | Decisión | Timeline |
|-------------|----------|----------|
| **@modelcontextprotocol/sdk** | **Mantener** | Indefinido |
| **Qdrant** | **Mantener** | Indefinido |
| **OpenAI embeddings** | **Mantener, evaluar modelos locales** | 12-18 meses |

MCP está explotando. Es el estándar para herramientas de AI. Foundation ya tiene integración MCP — esto es una **ventaja competitiva** enorme. Mantenelo.

A futuro, evaluá migrar de OpenAI embeddings a modelos locales (via Ollama) para reducir costos y latencia.

---

## Resumen visual del Roadmap

```
AHORA (0-3 meses)           PRONTO (3-12 meses)         LARGO PLAZO (12-24 meses)
─────────────────────       ─────────────────────        ──────────────────────────
🔄 Jest → Vitest            🔄 TypeORM → Drizzle         🔄 Evaluar NestJS → Fastify+tRPC
🔄 bcryptjs → @node-rs/     🔄 Swagger → Scalar         🔄 Evaluar DaisyUI → Tailwind vanilla
🔄 Upgrade TypeScript       🔄 Reducir DaisyUI           🔄 Evaluar S3 → Cloudflare R2
                            🔄 Upgrade Tailwind a v4.x    🔄 Evaluar OpenAI → Ollama local
                            🔄 Upgrade TanStack Table     🔄 Simplificar auth (patrones Lucia)
                                                        🔄 Evaluar Maizzle → React Email
                                                        
SIEMPRE (mantener indefinido)
─────────────────────────────
✅ PostgreSQL      ✅ BullMQ       ✅ Nuxt + Vue      ✅ TipTap
✅ Redis           ✅ Stripe       ✅ Pinia           ✅ Vee-Validate
✅ pnpm            ✅ Zod          ✅ VueUse          ✅ MCP
✅ Turborepo       ✅ Nodemailer   ✅ Hygen           ✅ Qdrant
✅ Node.js LTS     ✅ Passport/JWT (no tocar a menos que falle)
```

---

## Estrategia de migración progresiva

**Principio rector**: NUNCA hacer big-bang rewrites. Cada migración es un PR independiente que no rompe nada.

**Fase 1 — Quick Wins (0-3 meses, ~1 semana de trabajo):**
1. `bcryptjs → @node-rs/bcrypt`: cambios en 2-3 archivos del módulo IAM. Tests existentes confirman que nada se rompió.
2. `Jest → Vitest`: renombrar config, ajustar scripts. Tests existentes pasan o fallan por diferencias triviales.
3. `Upgrade TypeScript a latest`: si los tipos pasan, merge.

**Fase 2 — Migraciones estructurales (3-12 meses):**
1. `TypeORM → Drizzle (progresivo)`: Empezar con Drizzle en extensiones nuevas. Coexistir TypeORM + Drizzle. Migrar entities legacy una por una.
2. `Swagger → Scalar`: Cambio de UI solamente. La spec OpenAPI no cambia.
3. `DaisyUI reduction`: Refactors pequeños en componentes para usar Tailwind vanilla.

**Fase 3 — Evaluación (12-24 meses):**
1. Piloto de Fastify + tRPC en un proyecto nuevo chico (no migrar Foundation)
2. Si el piloto funciona bien, planificar migración parcial de Foundation
3. Evaluar el estado del ecosistema para decidir

---

## Relaciones

- [[Foundation]] — El stack documentado
- [[Comparativa - Foundation vs TanStack Start]] — Análisis de si migrar de stack completo
- [[Atenfy]] — Proyecto sobre Foundation
- [[SOM Tap - Tarjeta de Visita Digital Inteligente]] — Proyecto sobre Foundation
- [[SOM-OS CRM - Motor de Inteligencia Comercial]] — Próximo proyecto, usará extensiones
