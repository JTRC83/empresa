---
title: "Comparativa - Foundation vs TanStack Start"
date: 2026-06-01
tags:
  - investigacion
  - stack
  - comparativa
  - foundation
  - tanstack-start
  - arquitectura
  - decision-tecnica
description: "Análisis comparativo entre Foundation (NestJS + Nuxt 3 monorepo) y TanStack Start + DB como stack para proyectos del ecosistema SOM-OS.dev."
---

# Comparativa — Foundation vs TanStack Start

> [!info] Conclusión
> **Foundation y TanStack Start NO son comparables directamente.** Foundation es un _starter kit SaaS completo_ con 60+ componentes, auth, billing, CMS y más. TanStack Start es un _framework web full-stack_ — el equivalente a Next.js, no a un starter kit. Para el ecosistema SOM-OS.dev, Foundation es la opción correcta porque **ya contiene todo lo que habría que construir desde cero con TanStack Start.**

---

## Contexto

Esta investigación surge de la pregunta: ¿conviene seguir usando Foundation como base técnica para los proyectos del ecosistema, o migrar a TanStack Start + TanStack DB?

Fuentes del vault consultadas:
- [[Foundation]]
- [[Atenfy]]
- [[CanvasAPI]]
- [[SOM Tap - Tarjeta de Visita Digital Inteligente]]

---

## Qué es cada cosa

### Foundation (lo que ya tenemos)

**Categoría**: Starter kit SaaS / Plantilla modular
**Stack**: NestJS 11 + Nuxt 4 + Vue 3 + Turborepo + TypeORM + PostgreSQL
**Estado**: Producción, funcional, activo

Foundation es una **base completa** para construir aplicaciones SaaS. Incluye backend, frontend, infraestructura Docker, auth, billing, email, CMS, file storage, error tracking, i18n, sistema de extensiones, 60+ componentes UI y 15 entidades de dominio.

### TanStack Start

**Categoría**: Framework full-stack React
**Stack**: React + TanStack Router + Vite
**Estado**: Release Candidate (no v1), activo

TanStack Start es un **framework web** — compite con Next.js y Remix. Provee SSR, server functions (RPC), middleware y routing type-safe. NO es un starter kit SaaS: no incluye auth, billing, email, CMS, componentes UI, ni nada de negocio.

---

## Comparativa técnica

| Dimensión | Foundation | TanStack Start |
|-----------|-----------|----------------|
| **Tipo** | Starter kit SaaS | Framework web |
| **Frontend** | Nuxt 4 + Vue 3 | React (solo React) |
| **Backend** | NestJS (DDD, modulos) | Vite SSR + Server Functions |
| **Base de datos** | TypeORM + PostgreSQL + Redis | Sin ORM incluido (TanStack DB en beta) |
| **Auth** | JWT + API Keys + Social OAuth + RBAC + Sesiones | No incluido (integrar Clerk/Supabase/WorkOS) |
| **Billing** | Stripe integrado | No incluido |
| **Email** | Maizzle + BullMQ (async) | No incluido |
| **File Storage** | Local + S3 + Attachments polimórficos | No incluido |
| **CMS** | Páginas, Blog, SEO, Sitemap | No incluido |
| **Error Tracking** | Global filter + Telegram + deduplicación | No incluido |
| **i18n** | DB-driven, gestión de traducciones | No incluido |
| **Componentes UI** | 60+ (Kanban, DataTable, Calendar, Forms, etc.) | No incluido |
| **Extensiones** | Sistema drop-in auto-discovery | No tiene equivalente |
| **Testing** | Jest configurado | Depende de configuración manual |
| **Docker** | docker-compose completo | Requiere configuración manual |
| **Monorepo** | Turborepo con apps y paquetes | Vite workspace |
| **Madurez** | Producción, usado en proyectos reales | RC (no v1), ~14.5k stars GitHub |
| **TypeScript** | End-to-end | End-to-end |
| **SSR** | Nuxt 3 SSR/SSG | Full-document SSR + Streaming |

---

## Lo que TanStack Start tiene que Foundation NO tiene

1. **Server Functions** — RPC type-safe entre cliente y servidor sin REST boilerplate. En Foundation hacés llamadas HTTP a endpoints NestJS. TanStack Start compila directo: llamás una función y se vuelve fetch transparente.
2. **Streaming SSR** — Progressive rendering. Foundation usa SSR tradicional de Nuxt.
3. **TanStack DB** — Live queries reactivas (pero está en beta). Foundation usa TypeORM con queries tradicionales.
4. **Unified codebase** — Frontend y backend en el mismo proyecto React. Foundation los separa en `apps/back/` y `apps/front/`.
5. **Zero-bundle server code** — Tree-shaking automático: código server nunca llega al cliente. Foundation ya separa backend/frontend a nivel de proyecto.
6. **Middleware client+server** — Middleware que corre en ambos lados de la red. Foundation tiene guards/interceptors en backend y middleware de Nuxt en frontend, separados.

---

## Lo que Foundation tiene que TanStack Start NO tiene (y tendrías que construir)

| Feature | Esfuerzo estimado de construir en TanStack Start |
|---------|--------------------------------------------------|
| Auth JWT + API Keys + Social + RBAC | 2-3 semanas |
| Stripe billing | 1-2 semanas |
| Email con templates y colas | 1 semana |
| File storage local + S3 | 3-5 días |
| CMS con páginas, blog, SEO | 2-3 semanas |
| Error tracking con Telegram | 3-5 días |
| i18n con gestión DB | 1-2 semanas |
| Componentes UI (Kanban, DataTable, Calendar, Forms) | 3-4 semanas |
| Sistema de extensiones | 1-2 semanas |
| Docker completo | 2-3 días |
| Landing page completa | 3-5 días |

**Total estimado para replicar Foundation en TanStack Start: 12-18 semanas de trabajo full-time.** Y esto es solo para llegar a donde Foundation ya está hoy.

---

## TanStack DB (Beta) — ¿reemplaza TypeORM?

TanStack DB no es un ORM tradicional. Es una capa de **live queries reactivas** que se sincroniza en tiempo real. Está en **beta** y su ecosistema es mínimo comparado con TypeORM.

| Característica | TypeORM (Foundation) | TanStack DB |
|---------------|---------------------|-------------|
| Migraciones | Sí, auto-generadas | No documentado |
| Joins complejos | Sí (QueryBuilder) | Limitado |
| Transacciones | Sí | No claro |
| Relaciones polimórficas | Sí (FileEntity en Foundation) | No |
| Soft delete | Sí | No documentado |
| Seeds | Sí (Hygen generators) | No |
| Madurez | 8+ años, estable | Beta |
| Ecosistema | PostgreSQL, MySQL, SQLite, etc. | Depende del adapter |

---

## Implicaciones para SOM-OS.dev

### Foundation es la opción correcta porque:

1. **Los proyectos del ecosistema YA usan Foundation.** [[SOM Tap - Tarjeta de Visita Digital Inteligente|SOM Tap]] está construido sobre Foundation. Migrar sería reescribir todo.
2. **Foundation tiene todo lo que un SaaS necesita** de entrada. TanStack Start requeriría construir auth, billing, CMS, etc. desde cero.
3. **El modelo de negocio de SOM-OS.dev** es vender sistemas operativos empresariales llave en mano. Foundation permite entregar en semanas, no meses.
4. **Las extensiones de Foundation** son la ventaja competitiva: podés droppear features. TanStack Start no tiene equivalente.
5. **Vue vs React**: Foundation usa Vue/Nuxt. TanStack Start es React-only. Migrar implicaría cambiar todo el ecosistema de frontend.
6. **Madurez**: Foundation está en producción. TanStack Start es RC (ni siquiera v1).

### Cuándo SÍ podría considerarse TanStack Start:

- Para un **proyecto greenfield pequeño** sin necesidad de auth, billing, CMS, etc.
- Si el proyecto **requiere React sí o sí** (ej: integración con librerías React-only).
- Si se busca **máxima simplicidad** y no se necesita el ecosistema completo de Foundation.
- Para un **proyecto experimental** o prototipo rápido.

---

---

## Análisis Profundo: Tecnologías, Pesadez y Futuro

### 1. Pesadez real de Foundation

Foundation **no es pesado para lo que ofrece.** Pesan 620 líneas de markdown documentándolo — el proyecto en sí es un monorepo bien estructurado.

**Lo que SÍ pesa:**

| Componente | ¿Pesa? | Por qué |
|-----------|--------|---------|
| NestJS | Medio | Framework opinado con decorators, modules, DI. Curva de aprendizaje, pero paga con estructura. |
| TypeORM | Medio-alto | Migraciones, entities, repositories. Más boilerplate que Prisma o Drizzle. Pero Foundation YA tiene todo armado. |
| Nuxt 3 | Bajo-medio | El ecosistema Nuxt es maduro y estable. Auto-imports, file-based routing, layers. |
| Turborepo | Bajo | Solo caching y task orchestration. Transparente. |
| Extensions system | Medio | Complejidad interna (loader, conflict detector, dependency resolver). Pero para el desarrollador de producto es **droppear y listo**. |
| Docker | Bajo | Ya configurado. No se toca. |

**Lo que NO pesa:**
- No estás configurando auth desde cero
- No estás buildendo un CMS de cero
- No estás armando componentes UI
- Las migraciones y seeds ya tienen generators
- El error tracking ya funciona

**El verdadero peso no es Foundation — es lo que Foundation te evita construir.**

### 2. Pesadez de TanStack Start (la que no se ve)

TanStack Start parece "ligero" porque no trae nada. Pero la pesadez aparece **cuando empezás a construir lo que falta:**

| Lo que falta | Complejidad real |
|-------------|-----------------|
| Auth | Elegir entre Clerk ($), Supabase, WorkOS, o construir JWT manual con refresh tokens, sesiones, RBAC. Clerk son $25/mes base + $0.02/MAU. |
| DB real | TanStack DB es beta y no es ORM. Necesitás Drizzle o Prisma + PostgreSQL aparte. |
| Email | Elegir provider (Resend, SendGrid), armar templates, manejar colas. |
| CMS | O integrás Strapi/Contentful (más infra) o construís uno custom. |
| File Storage | S3 SDK + lógica de attachments + cleanup. |
| UI Components | shadcn/ui es buen candidato, pero no tiene Kanban, Calendar avanzado, ni DataTable server-side out of the box. |
| Admin Dashboard | Construir todo el layout, sidebar, breadcrumbs, auth flows. |
| i18n | next-intl o similar. Foundation ya tiene DB-driven translations con UI de gestión. |

**TanStack Start es ligero en `npm install`, pesadísimo en `lo que falta`.**

### 3. Vue vs React — proyección a 5 años

Mirá los datos de State of JS 2025:

- **React**: 78% usage, dominante, pero con **pain points #1** (complejidad excesiva, performance, state management)
- **Vue**: ~45% usage, estable, **sin growth ni declive** — es un "safe bet"
- La gente usa **2.6 frameworks en toda su carrera** — no saltan como se cree
- **TanStack Start**: solo 33 menciones en "Other Frameworks". No es mainstream.

**¿Qué significa esto?**

- Vue no va a desaparecer. Tiene ecosistema maduro (Nuxt, Vite, Pinia), comunidad leal, y empresas grandes atrás (Alibaba, GitLab, Nintendo).
- React va a seguir dominando, pero con creciente complejidad (RSC, Server Components, streaming — cada feature nueva suma superficie).
- Si Foundation te funciona en Vue, NO hay razón técnica para migrar a React. La decisión sería religiosa, no técnica.
- El verdadero riesgo futuro no es Vue vs React — es **si los asistentes AI codifican mejor en React que en Vue.** Hoy: React tiene más training data. En 2 años: los AI van a ser agnósticos. No es factor decisivo.

### 4. NestJS vs Server Functions — la arquitectura del backend

**Server Functions (TanStack Start)**:
- RPC type-safe sin REST boilerplate
- Código server y client en el mismo archivo (colocation)
- Tree-shaking automático: código server nunca en bundle cliente
- Menos archivos, menos ceremonias

**NestJS (Foundation)**:
- DDD con separación clara: `domain/`, `dto/`, `infrastructure/`, controller, service
- Guards, interceptors, pipes, filters — battle-tested
- TypeORM con migraciones auto-generadas
- 15 entidades ya modeladas, testeadas

**¿Cuál es mejor a futuro?**

Las Server Functions son el futuro de cómo escribimos backends. Next.js las tiene (Server Actions), Remix las tiene (actions/loaders), TanStack Start las tiene. **El patrón está ganando.**

PERO: NestJS no te impide usar RPC. Podrías:
- Agregar tRPC sobre NestJS para tener RPC type-safe
- O usar los controllers existentes con un SDK generado (OpenAPI → TypeScript client)

**No necesitás tirar NestJS para tener la DX de Server Functions.**

### 5. El sistema de extensiones — ¿ventaja real o sobre-ingeniería?

El sistema de extensiones de Foundation es **tu ventaja competitiva número 1 como negocio.**

Por qué:
- Cada cliente de SOM-OS.dev recibe una app modular. Un cliente necesita CRM, otro necesita inventory, otro necesita booking.
- Con Foundation: `pnpm generate:extension crm` y tenés el scaffold. Dropeás en `extensions/` y se auto-descubre.
- Con TanStack Start: cada feature es un nuevo route + server function + db schema + UI. Sin convención ni auto-discovery.
- El modelo de negocio ([[SOM-OS — Arquitectura de Sistemas Digitales]]) se basa en construir POR MÓDULOS. Las extensiones son la implementación técnica de ese modelo.

Esto **no es sobre-ingeniería** — es el core del producto.

### 6. TypeORM vs TanStack DB vs Drizzle — futuro de la capa de datos

**TypeORM** (Foundation):
- 8+ años, estable, PostgreSQL-first
- Migraciones auto-diff, seeds, QueryBuilder
- PERO: activo mantenimiento mínimo, sintaxis verbosa, issues abiertos sin resolver
- El riesgo real: TypeORM puede quedar legacy. La comunidad migra a Drizzle y Prisma.

**TanStack DB** (beta):
- No es ORM. Es capa de sync reactiva.
- No reemplaza TypeORM — necesitás algo más para schema, migraciones, seeds.
- Está en beta. No para producción hoy.

**Drizzle ORM** (alternativa futura):
- Type-safe, SQL-like, lightweight
- 25k+ GitHub stars, crecimiento rápido
- Migraciones, relaciones, PostgreSQL nativo
- Podría ser el reemplazo natural de TypeORM en Foundation v2

**Recomendación**: Foundation con TypeORM hoy está bien. Pero en 12-18 meses, considerá migrar de TypeORM → Drizzle (no de Foundation → TanStack Start). Mantenés toda la arquitectura y solo cambiás la capa de datos.

### 7. Hiring y talent pool

| Stack | Disponibilidad | Costo |
|-------|---------------|-------|
| NestJS devs | Media. Menos que Express, pero existen. Buenos devs NestJS son caros. | $$$ |
| Vue/Nuxt devs | Media-baja. Menos que React, pero comunidad leal. | $$-$$$ |
| React devs | Alta. El pool más grande del mercado. | $$ |
| TanStack Start devs | Muy baja. Framework nuevo, pocos lo conocen. | ? |

**Realidad**: Para SOM-OS.dev, Adrián Colom es el que construye. El hiring no es factor hoy. Si escala a equipo, Vue devs + NestJS devs se consiguen, pero React devs son más abundantes.

### 8. Rendimiento y bundle size

| Métrica | Foundation (Nuxt 3) | TanStack Start |
|---------|---------------------|----------------|
| SSR performance | Excelente. Nitro server de Nuxt es rapidísimo. | Bueno. Vite SSR, streaming. |
| Client bundle | ~80-120KB (Vue + Nuxt runtime) | ~40-60KB (React + Router) |
| Server bundle | NestJS compilado, ~2-5MB | Vite SSR, ~500KB-2MB |
| Cold start | Medio (NestJS DI container) | Rápido (Vite SSR) |
| Streaming | No nativo en Nuxt 3 (posible con hacks) | Nativo en TanStack Start |

**¿Importa?** Para el 95% de los proyectos SOM-OS.dev, no. Si un cliente necesita servir 10K requests/segundo, hay optimizaciones. Pero el cuello de botella va a ser la lógica de negocio y la DB, no el framework.

### 9. El verdadero riesgo futuro: vendor lock-in y deuda técnica

**Foundation:**
- **Riesgo**: NestJS + TypeORM podrían volverse legacy.
- **Mitigación**: Los patrones (DDD, hexagonal) son agnósticos de framework. Podés cambiar NestJS → Fastify o TypeORM → Drizzle sin reescribir lógica de negocio.
- **Riesgo**: Nuxt puede quedarse atrás de Next.js en features.
- **Realidad**: Nuxt viene al día. Nuxt 4 ya salió. El equipo es sólido.

**TanStack Start:**
- **Riesgo**: Es RC. Podría pivotar, perder momentum, o tener breaking changes antes de v1.
- **Riesgo**: Si TanStack Start no despega, te quedás con un stack huérfano.
- **Riesgo**: Dependencia de un solo maintainer (Tanner Linsley). Si se va, ¿qué pasa?
- **Riesgo**: React Server Components y RSC son el estándar que está empujando Vercel/Next.js. TanStack Start va por Server Functions que son similares pero no idénticas. Fragmentación.

### 10. Escenario realista a 3 años

**Si te quedás con Foundation:**
- Año 1: Seguís construyendo proyectos (Atenfy, SOM Tap, CRM) sobre Foundation. Rápido, estable.
- Año 2: Evaluás migrar TypeORM → Drizzle. Evaluás Server Functions pattern con tRPC sobre NestJS.
- Año 3: Foundation v2 podría ser: Fastify + Drizzle + tRPC + Nuxt 4. Misma arquitectura, tools actualizadas.

**Si migrás a TanStack Start:**
- Año 1: 3-4 meses construyendo el equivalente de Foundation (auth, billing, CMS, UI). Perdiste velocidad de entrega.
- Año 2: TanStack Start llega a v1. Rompe algunas APIs. Actualizás.
- Año 3: Si TanStack Start ganó tracción, bien. Si no, evaluás migrar a Next.js o Remix. Riesgo de migración otra vez.

### 11. Veredicto técnico

| Factor | Gana |
|--------|------|
| Velocidad de entrega HOY | **Foundation** (por mucho) |
| Mantenibilidad | **Foundation** (DDD, modular) |
| DX (experiencia dev) | **TanStack Start** (RPC, colocation, menos boilerplate) |
| Rendimiento | **TanStack Start** (Vite SSR, streaming) |
| Ecosistema disponible | **Foundation** (60+ componentes, 15 entidades) |
| Madurez | **Foundation** (producción vs RC) |
| Futuro (2028+) | Empate. Depende de ejecución, no de tecnología. |
| Alineación con modelo de negocio | **Foundation** (extensiones = módulos) |

**Foundation gana 5-1-1.** No porque sea tecnológicamente superior, sino porque **es la herramienta correcta para el problema correcto.** TanStack Start es un excelente framework — para un proyecto greenfield sin requisitos SaaS complejos.

---

## Recomendación final

**Quedate con Foundation.** Pero:

1. **A corto plazo (0-6 meses)**: No toques nada. Foundation funciona. Construí proyectos.
2. **A mediano plazo (6-18 meses)**: Evaluá migrar TypeORM → Drizzle ORM dentro de Foundation. Misma arquitectura DDD, queries type-safe, menos boilerplate.
3. **Explorá Server Functions**: Agregá tRPC sobre NestJS para tener la DX de RPC sin cambiar de stack. Mejor de los dos mundos.
4. **Monitoreá TanStack Start**: Cuando llegue a v2 (2027-2028), re-evaluá. Para entonces va a estar maduro o muerto.
5. **No migres por FOMO**: TanStack Start es shiny. Pero shiny ≠ productivo. Foundation YA entrega valor.

---

## Relaciones

- [[Foundation]] — La base técnica actual del ecosistema
- [[SOM Tap - Tarjeta de Visita Digital Inteligente]] — Construido sobre Foundation
- [[Atenfy]] — Construido sobre Foundation
- [[CanvasAPI]] — Stack independiente, podría beneficiarse de Foundation
- [[SOM-OS CRM - Motor de Inteligencia Comercial]] — Diseñado como extensión de Foundation (27.5h vs meses)
- [[Propuesta de Valor - Sistemas operativos empresariales]]
- [[Producto - App central + módulos]]
- [[SOM-OS — Arquitectura de Sistemas Digitales]] — El modelo de negocio que las extensiones implementan
