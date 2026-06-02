---
type: index
auto-generated: true
folder: "06 - Proyectos"
---

# 06 - Proyectos

```
├── 📄 Atenfy.md
├── 📄 CanvasAPI.md
├── 📄 CommitWear.md
├── 📁 Foundation/
│   ├── 📄 Core - Sistema de Núcleo.md
│   ├── 📁 Extensiones/
│   │   ├── 📄 CMS - Content Management System.md
│   │   ├── 📄 Landing - Paginas Publicas.md
│   │   ├── 📄 Sistema de Extensiones.md
│   │   ├── 📄 Stripe - Integracion de Pagos.md
│   ├── 📄 Graphify - Knowledge Graph y OpenCode.md
│   ├── 📄 Infraestructura - Base de Datos y Utilidades.md
│   ├── 📁 Modulos/
│   │   ├── 📄 Billing - Facturacion.md
│   │   ├── 📄 Communications - Comunicaciones y Email.md
│   │   ├── 📄 Error Tracker - Monitoreo de Errores.md
│   │   ├── 📄 IAM - Identity y Access Management.md
│   │   ├── 📄 Storage - Sistema de Archivos.md
│   │   ├── 📄 Translations - Internacionalizacion.md
│   │   ├── 📄 UI App - Toolkit de Componentes.md
│   │   ├── 📄 Users - Gestión de Usuarios.md
├── 📄 Foundation.md
├── 📄 GenLegalTxts.md
├── 📄 SOM Tap - Tarjeta de Visita Digital Inteligente.md
├── 📄 SOM-OS CRM - Motor de Inteligencia Comercial.md
├── 📄 Valor Balear - Arquitectura de Pagos.md
├── 📄 Valor Balear.md
```

## Raíz

- [[Atenfy|Atenfy]] — title: "Atenfy"
- [[CanvasAPI|CanvasAPI]] — title: "CanvasAPI"
- [[CommitWear|CommitWear]] — title: "CommitWear"
- [[Foundation|Foundation]] — title: "Foundation"
- [[GenLegalTxts|GenLegalTxts]] — title: "GenLegalTxts"
- [[SOM Tap - Tarjeta de Visita Digital Inteligente|SOM Tap - Tarjeta de Visita Digital Inteligente]] — title: "Somos Tap - Tarjeta de Visita Digital Inteligente"
- [[SOM-OS CRM - Motor de Inteligencia Comercial|SOM-OS CRM - Motor de Inteligencia Comercial]] — title: "SOM-OS CRM - Motor de Inteligencia Comercial"
- [[Valor Balear - Arquitectura de Pagos|Valor Balear — Arquitectura de Pagos]] — Decisión de arquitectura de pagos para Valor Balear. Análisis comparativo de Stripe Connect, Mollie y PaynoPain como soluciones de split payment multi-vendor para el marketplace de productos baleares. `#proyecto #valor-balear #pagos #arquitectura #decision #stripe-connect #mollie #paynopain #marketplace #multi-vendor`
- [[Valor Balear|Valor Balear]] — title: "Valor Balear"

## Foundation

- [[Foundation/Core - Sistema de Núcleo|Core — Sistema de Núcleo]] — Sistema de núcleo de Foundation. Extension Loader, Foundation Module, Infrastructure Module, config factories, y utilidades compartidas del backend. `#backend #core #nestjs #extension-loader #config #infrastructure`
- [[Foundation/Graphify - Knowledge Graph y OpenCode|Graphify — Knowledge Graph y OpenCode]] — Integración de Graphify con OpenCode. Cómo el knowledge graph analiza Foundation y el vault SOM-OS.dev, y cómo OpenCode lo consulta para reducir tokens y encontrar conexiones no obvias. `#graphify #knowledge-graph #opencode #busqueda #semantica`
- [[Foundation/Infraestructura - Base de Datos y Utilidades|Infraestructura — Base de Datos y Utilidades]] — Infraestructura de Foundation: configuración de TypeORM, migraciones, seeds, sistema de email (Nodemailer), y utilidades compartidas del backend. `#backend #infraestructura #typeorm #database #migraciones #seeds #docker`

## Foundation/Extensiones

- [[Foundation/Extensiones/CMS - Content Management System|CMS — Content Management System]] — Extensión CMS de Foundation. Content Management System completo con páginas, blog (posts, categorías, tags), SEO metadata, upload de media, y sitemap dinámico. 68 endpoints, 5 entidades, 16 permisos. `#extension #cms #blog #seo #media #sitemap #content`
- [[Foundation/Extensiones/Landing - Paginas Publicas|Landing — Páginas Públicas]] — Extensión frontend de páginas públicas de Foundation. 15 componentes de marketing: hero, features, pricing, FAQ, testimonials, team, contacto, footer. Módulo Nuxt independiente en modules/landing/. `#extension #frontend #nuxt #vue #landing #marketing`
- [[Foundation/Extensiones/Sistema de Extensiones|Sistema de Extensiones — Foundation]] — Arquitectura completa del sistema de extensiones auto-descubribles de Foundation. Pipeline de 5 fases: discovery, manifiestos, conflict detection, dependency resolution, y carga de módulos. Ciclo de vida completo desde creación hasta distribución. `#extensiones #plugins #auto-discovery #manifiestos #dependency-resolution #conflict-detection`
- [[Foundation/Extensiones/Stripe - Integracion de Pagos|Stripe — Integración de Pagos]] — Extensión Stripe de Foundation. Integración completa de Stripe: productos, precios, planes, suscripciones, checkout sessions, facturas PDF, webhooks y PlanGuard para control de acceso. `#extension #stripe #billing #pagos #suscripciones #checkout #webhooks`

## Foundation/Modulos

- [[Foundation/Modulos/Billing - Facturacion|Billing — Facturación]] — Módulo placeholder de facturación en Foundation. Reservado para lógica de facturación futura. Actualmente vacío — la funcionalidad de billing está en la extensión Stripe. `#backend #nestjs #billing #placeholder`
- [[Foundation/Modulos/Communications - Comunicaciones y Email|Communications — Comunicaciones y Email]] — Sistema de comunicaciones de Foundation. Email transaccional con colas BullMQ + Redis, templates Handlebars compilados con Maizzle (Tailwind CSS), y fallback síncrono si Redis no disponible. `#backend #nestjs #email #bullmq #nodemailer #handlebars #maizzle`
- [[Foundation/Modulos/Error Tracker - Monitoreo de Errores|Error Tracker — Monitoreo de Errores]] — Módulo full-stack de tracking de errores. Backend: deduplicación SHA256, GlobalExceptionFilter, notificaciones Telegram. Frontend: dashboard de errores, plugin global de captura Vue/JS, test de errores. `#backend #frontend #nestjs #nuxt #errores #monitoreo #telegram #deduplication`
- [[Foundation/Modulos/IAM - Identity y Access Management|IAM — Identity & Access Management]] — Módulo full-stack de autenticación y autorización. Backend: 4 estrategias Passport, OAuth social, API Keys, RBAC. Frontend: Pinia store con JWT refresh automático, 5 componentes de formularios, 4 middlewares de protección de rutas. `#backend #frontend #nestjs #nuxt #auth #autenticacion #jwt #passport #rbac #pinia #middleware`
- [[Foundation/Modulos/Storage - Sistema de Archivos|Storage — Sistema de Archivos]] — Módulo full-stack de gestión de archivos. Backend: sistema polimórfico con 3 drivers (local, S3, S3-presigned), Sharp, cascade delete. Frontend: dashboard de stats, upload drag & drop, DataTable con preview, TanStack Query. `#backend #frontend #nestjs #nuxt #storage #archivos #s3 #upload #polymorphic #tanstack-query`
- [[Foundation/Modulos/Translations - Internacionalizacion|Translations — Internacionalización]] — Módulo full-stack de internacionalización. Backend: CRUD de idiomas/traducciones en DB, generación JSON, traducción IA (LangChain + OpenRouter). Frontend: tabla multi-idioma con edición inline, auto-traducción IA, panel de administración. `#backend #frontend #nestjs #nuxt #i18n #traducciones #ai #langchain`
- [[Foundation/Modulos/UI App - Toolkit de Componentes|UI App — Toolkit de Componentes]] — Toolkit de componentes UI de Foundation. Módulo solo frontend con DataTable (TanStack Table v8), 11 form components (vee-validate + Zod), Kanban drag & drop, Calendario 4 vistas, y RichEditor TipTap. Páginas demo incluidas. `#frontend #nuxt #vue #componentes #datatable #formularios #kanban #calendario #editor`
- [[Foundation/Modulos/Users - Gestión de Usuarios|Users — Gestión de Usuarios]] — Módulo de gestión de usuarios de Foundation. CRUD completo con fotos de perfil polimórficas, estados activo/inactivo, soft delete, y arquitectura hexagonal con repositorio aislado. `#backend #nestjs #users #crud #typeorm #soft-delete`

