---
title: "Módulos Backend — Foundation"
date: 2026-06-02
tags:
  - backend
  - nestjs
  - modulos
  - documentacion
description: "Documentación detallada de los 7 módulos backend de Foundation: IAM, Users, Storage, Communications, Error Tracker, Translations y Billing."
---

# Módulos

> [!info] Organización
> Documentación de todos los módulos de Foundation — tanto backend como frontend, organizados por dominio. Los módulos full-stack (IAM, Translations, Error Tracker, Storage) documentan backend y frontend en un solo archivo.

## Módulos Full-Stack (Backend + Frontend)

| Módulo | Backend | Frontend | Contenido |
|--------|---------|----------|-----------|
| [[Foundation/Modulos/IAM - Identity y Access Management\|IAM]] | `modules/iam/` | `modules/base/auth/` | Auth: 4 estrategias Passport, Pinia store, JWT refresh, 5 componentes, 4 middlewares |
| [[Foundation/Modulos/Translations - Internacionalizacion\|Translations]] | `modules/translations/` | `modules/base/translations/` | i18n: CRUD DB + JSON gen + IA (LangChain). Tabla multi-idioma con edición inline |
| [[Foundation/Modulos/Error Tracker - Monitoreo de Errores\|Error Tracker]] | `modules/error-tracker/` | `modules/base/error-tracker/` | Errores: SHA256 dedup + Telegram. Dashboard + plugin captura global |
| [[Foundation/Modulos/Storage - Sistema de Archivos\|Storage]] | `modules/storage/` | `modules/base/storage/` | Archivos: 3 drivers + Sharp + cascade delete. Dashboard + TanStack Query |

## Módulos Solo Backend

| Módulo | Propósito |
|--------|-----------|
| [[Foundation/Modulos/Users - Gestión de Usuarios\|Users]] | CRUD usuarios + fotos polimórficas + soft delete |
| [[Foundation/Modulos/Communications - Comunicaciones y Email\|Communications]] | Email transaccional + BullMQ + Maizzle templates |
| [[Foundation/Modulos/Billing - Facturacion\|Billing]] | Placeholder (la funcionalidad real está en [[Foundation/Extensiones/Stripe - Integracion de Pagos\|Stripe]]) |

## Módulos Solo Frontend

| Módulo | Propósito |
|--------|-----------|
| [[Foundation/Modulos/UI App - Toolkit de Componentes\|UI App]] | Toolkit visual: DataTable, 11 form components, Kanban, Calendar 4 vistas, TipTap editor |

## Patrones Arquitectónicos Compartidos

Todos los módulos siguen estos patrones:

### PersistenceModule Pattern
Cada módulo expone un submódulo de persistencia aislado (`UserPersistenceModule`, `SessionPersistenceModule`, etc.) que encapsula TypeORM. El módulo principal importa el de persistencia — esto permite testing con repositorios mock.

### Arquitectura Hexagonal
```
domain/          → Interfaces puras de dominio
infrastructure/  → Implementaciones TypeORM (entities, repositories, mappers)
dto/             → Request/Response DTOs
controller.ts    → Endpoints REST
service.ts       → Lógica de negocio
```

### Soft Delete
`UserEntity` y `SessionEntity` usan `@DeleteDateColumn` de TypeORM. Las entidades no se borran físicamente.

### Paginación Infinita
Los endpoints de listado usan `infinity-pagination.ts` que retorna `{ total, per_page, current_page, last_page, data, hasNextPage }`.

---

## Relaciones

- [[Foundation/index|Foundation]] — Índice general de documentación
- [[Foundation/Extensiones/index|Extensiones]] — Sistema de extensiones
- [[Foundation/Core - Sistema de Núcleo|Core]] — Sistema de núcleo que carga estos módulos
