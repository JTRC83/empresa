---
title: "Stripe — Integración de Pagos"
date: 2026-06-02
tags:
  - extension
  - stripe
  - billing
  - pagos
  - suscripciones
  - checkout
  - webhooks
description: "Extensión Stripe de Foundation. Integración completa de Stripe: productos, precios, planes, suscripciones, checkout sessions, facturas PDF, webhooks y PlanGuard para control de acceso."
---

# Stripe — Integración de Pagos

> [!info] Resumen
> Integración completa de **Stripe** como extensión auto-descubrible. Gestiona productos, precios, planes, suscripciones, checkout sessions, portal de cliente, webhooks, facturas PDF, y un guard de control de acceso por plan. Ubicado en `apps/back/src/extensions/stripe/`.

## Estructura

```
extensions/stripe/
├── extension.manifest.ts      # name: "stripe", v1.0.0, 22 routes, 5 entities
├── extension.module.ts        # StripeExtensionModule: 8 controllers, 7 services
├── extension.config.ts        # Stripe config factory (secretKey, webhookSecret, etc.)
├── stripe.provider.ts         # Provider del SDK de Stripe
├── config/
│   └── stripe-config.type.ts  # StripeConfig interface
├── controllers/
│   ├── products.controller.ts      # CRUD de productos
│   ├── prices.controller.ts        # CRUD de precios
│   ├── plans.controller.ts         # CRUD de planes
│   ├── subscriptions.controller.ts # CRUD de suscripciones
│   ├── checkout.controller.ts      # Sesiones de checkout
│   ├── invoices.controller.ts      # Listado de facturas
│   ├── webhooks.controller.ts      # Webhooks de Stripe
│   └── stripe-test.controller.ts   # Endpoint de prueba
├── services/
│   ├── stripe.service.ts           # Wrapper del SDK de Stripe
│   ├── products.service.ts
│   ├── prices.service.ts
│   ├── plans.service.ts
│   ├── subscriptions.service.ts
│   ├── webhooks.service.ts
│   └── pdf-invoice.service.ts      # Generación de facturas PDF
├── domain/                    # Product, Price, Plan, Subscription, UsageRecord
├── dto/                       # 9 DTOs: create/update para cada entidad + record-usage
├── infrastructure/
│   └── persistence/
│       └── entities/          # 5 entidades con prefijo ext_stripe_
├── middleware/
│   └── plan-guard.ts          # Control de acceso por plan
└── seeds/                     # Seeds de planes y productos
```

## Manifiesto

```typescript
{
  name: "stripe",
  version: "1.0.0",
  contributes: {
    routes: 22,
    entities: 5,       // Product, Price, Plan, Subscription, UsageRecord
    seeds: true,
    config: ["stripe"],
    menuItems: [
      {
        heading: "Billing",
        items: [
          { title: "Products", to: "/admin/stripe/products", icon: "Package" },
          { title: "Plans", to: "/admin/stripe/plans", icon: "CreditCard" },
          { title: "Subscriptions", to: "/admin/stripe/subscriptions", icon: "RefreshCw" },
          { title: "Invoices", to: "/admin/stripe/invoices", icon: "FileText" },
        ]
      }
    ],
    permissions: 12
  }
}
```

## Controladores y Endpoints

### Products (`/stripe/products`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Listar productos |
| `POST` | `/` | Crear producto (en Stripe + DB) |
| `GET` | `/:id` | Ver producto |
| `PATCH` | `/:id` | Actualizar producto |
| `DELETE` | `/:id` | Eliminar producto |

### Prices (`/stripe/prices`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Listar precios |
| `POST` | `/` | Crear precio |
| `GET` | `/:id` | Ver precio |
| `PATCH` | `/:id` | Actualizar precio |
| `DELETE` | `/:id` | Eliminar precio |

### Plans (`/stripe/plans`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Listar planes |
| `POST` | `/` | Crear plan |
| `GET` | `/:id` | Ver plan |
| `PATCH` | `/:id` | Actualizar plan |
| `DELETE` | `/:id` | Eliminar plan |

### Subscriptions (`/stripe/subscriptions`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Listar suscripciones |
| `POST` | `/` | Crear suscripción |
| `GET` | `/:id` | Ver suscripción |
| `PATCH` | `/:id` | Actualizar suscripción |
| `DELETE` | `/:id` | Cancelar suscripción |

### Checkout

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/stripe/checkout` | Crear Stripe Checkout Session |

### Invoices

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/stripe/invoices` | Listar facturas del usuario |

### Webhooks

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/stripe/webhooks` | Endpoint de webhooks de Stripe |

### Test

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/stripe/test/payment` | Simular pago (solo desarrollo) |

## Entidades (5)

Todas usan prefijo `ext_stripe_`:

| Entidad | Tabla | Descripción |
|---------|-------|-------------|
| `ProductEntity` | `ext_stripe_product` | Producto en Stripe |
| `PriceEntity` | `ext_stripe_price` | Precio asociado a producto |
| `PlanEntity` | `ext_stripe_plan` | Plan que agrupa precios |
| `SubscriptionEntity` | `ext_stripe_subscription` | Suscripción de usuario |
| `UsageRecordEntity` | `ext_stripe_usage_record` | Registro de uso (billing por uso) |

## Servicios

| Servicio | Propósito |
|----------|-----------|
| `StripeService` | Wrapper del SDK de Stripe. Inicialización, métodos helpers |
| `ProductsService` | CRUD de productos (DB + Stripe API) |
| `PricesService` | CRUD de precios |
| `PlansService` | CRUD de planes |
| `SubscriptionsService` | CRUD de suscripciones |
| `WebhooksService` | Procesamiento de eventos de Stripe (checkout.completed, subscription.updated, etc.) |
| `PdfInvoiceService` | Generación de facturas en PDF |

## PlanGuard — Control de Acceso por Plan

Middleware que restringe acceso a features según el plan del usuario:

```typescript
@Injectable()
export class PlanGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener usuario autenticado
    // 2. Buscar suscripción activa
    // 3. Verificar que el plan incluya la feature requerida
    // 4. Lanzar 403 si no tiene acceso
  }
}
```

Uso:
```typescript
@UseGuards(PlanGuard)
@SetMetadata('requiredPlan', 'pro')
@Get('premium-feature')
```

## Webhooks Procesados

| Evento | Acción |
|--------|--------|
| `checkout.session.completed` | Activar suscripción, actualizar `stripeCustomerId` en UserEntity |
| `customer.subscription.updated` | Actualizar estado de suscripción |
| `customer.subscription.deleted` | Marcar suscripción como cancelada |
| `invoice.paid` | Enviar email con factura PDF (via [[Foundation/Modulos/Communications - Comunicaciones y Email|MailService]]) |
| `invoice.payment_failed` | Notificar fallo de pago |

## Configuración

```typescript
// stripe.config.ts
{
  secretKey: string;           // Stripe secret key
  webhookSecret: string;       // Webhook signing secret
  publicKey: string;           // Stripe publishable key
  successUrl: string;          // URL post-checkout exitoso
  cancelUrl: string;           // URL post-checkout cancelado
}
```

## Dependencias

- **UsersModule** — Para asociar `stripeCustomerId` a usuarios
- **MailService** — Para enviar facturas por email
- **TypeORM** — 5 entidades propias
- **Stripe SDK** — `stripe` npm package

## Relaciones

- [[Foundation/Extensiones/index|Extensiones]] — Índice de extensiones
- [[Foundation/Extensiones/Sistema de Extensiones|Sistema de Extensiones]] — Cómo se carga Stripe
- [[Foundation/Modulos/Communications - Comunicaciones y Email|Communications]] — Emails de factura
- [[Foundation/Modulos/Users - Gestión de Usuarios|Users]] — Usuarios con stripeCustomerId
- [[Foundation/Frontend/index|Frontend]] — `useSubscription` composable
