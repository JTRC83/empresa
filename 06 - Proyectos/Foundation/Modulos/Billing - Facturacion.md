---
title: "Billing — Facturación"
date: 2026-06-02
tags:
  - backend
  - nestjs
  - billing
  - placeholder
description: "Módulo placeholder de facturación en Foundation. Reservado para lógica de facturación futura. Actualmente vacío — la funcionalidad de billing está en la extensión Stripe."
---

# Billing — Facturación

> [!warning] Placeholder
> Este módulo (`apps/back/src/modules/billing/`) está **vacío**. Es un placeholder reservado para lógica de facturación futura.

## Estado Actual

```typescript
@Module({})
export class BillingModule {}
```

- Sin controladores
- Sin servicios
- Sin entidades
- Sin DTOs

## Nota

La funcionalidad real de billing (Stripe) está implementada como **extensión** en [[Foundation/Extensiones/Stripe - Integracion de Pagos|Stripe Extension]]. Este módulo existe como placeholder para lógica de facturación que no sea específica de Stripe (ej: facturación manual, créditos, etc.).

## Relaciones

- [[Foundation/Modulos/index|Módulos Backend]] — Índice de módulos
- [[Foundation/Extensiones/Stripe - Integracion de Pagos|Stripe Extension]] — Funcionalidad real de billing
