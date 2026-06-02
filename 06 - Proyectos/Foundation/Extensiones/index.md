---
title: "Extensiones — Foundation"
date: 2026-06-02
tags:
  - extensiones
  - plugins
  - auto-discovery
  - cms
  - stripe
description: "Documentación del sistema de extensiones auto-descubribles de Foundation y las dos extensiones implementadas: CMS y Stripe."
---

# Extensiones

> [!info] Sistema de Plugins Drop-in
> Foundation implementa un **sistema de extensiones auto-descubrible** que permite agregar features copiando una carpeta a `extensions/` sin modificar el core. Las extensiones se detectan, validan y cargan automáticamente al iniciar la aplicación.

## Documentos

| Documento | Tipo | Contenido |
|-----------|------|-----------|
| [[Foundation/Extensiones/Sistema de Extensiones|Sistema de Extensiones]] | Core | Arquitectura completa: auto-discovery, manifiestos, conflict detection, dependency resolution, ciclo de vida |
| [[Foundation/Extensiones/CMS - Content Management System|CMS]] | Backend | Content Management System: páginas, blog, SEO, media, sitemap. 68 endpoints, 5 entidades |
| [[Foundation/Extensiones/Stripe - Integracion de Pagos|Stripe]] | Backend | Integración completa de Stripe: productos, precios, planes, suscripciones, checkout, webhooks, facturas PDF |
| [[Foundation/Extensiones/Landing - Paginas Publicas|Landing]] | Frontend | 15 componentes de marketing: hero, features, pricing, FAQ, testimonials. Módulo Nuxt independiente |

## Estado Actual

- ✅ **Sistema de extensiones implementado** — `ExtensionLoaderModule`, conflict detection, dependency resolution, seed loader, config loader
- ✅ **CMS Extension** — Completa, producción-ready. 68 endpoints, 5 entidades, 16 permisos, 10 items de menú
- ✅ **Stripe Extension** — Completa. 22 endpoints, 5 entidades, 7 servicios, PlanGuard
- ⚠️ **CLI tools** — `add-extension`, `remove-extension`, `build-extension`, `create-bundle` en `bin/`
- ⚠️ **MCP Vector Search** — Histórico, removido de HEAD. Documentado por referencia

## Convención de Extensiones

Toda extensión sigue esta estructura:

```
extensions/<nombre>/
├── extension.module.ts       # NestJS Module (OBLIGATORIO)
├── extension.manifest.ts     # Metadata: rutas, entidades, permisos, menú
├── extension.config.ts       # Config factories (opcional)
├── *.controller.ts           # Endpoints REST
├── *.service.ts              # Lógica de negocio
├── domain/                   # Objetos de dominio
├── dto/                      # Request/Response DTOs
├── infrastructure/           # TypeORM entities, repositories
└── seeds/                    # Datos de seed (opcional)
```

## Relaciones

- [[Foundation/index|Foundation]] — Índice general
- [[Foundation/Modulos/index|Módulos Backend]] — Features core vs extensiones
- [[Foundation/Core - Sistema de Núcleo|Core]] — El Extension Loader que hace todo esto posible
