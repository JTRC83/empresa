---
title: "Communications — Comunicaciones y Email"
date: 2026-06-02
tags:
  - backend
  - nestjs
  - email
  - bullmq
  - nodemailer
  - handlebars
  - maizzle
description: "Sistema de comunicaciones de Foundation. Email transaccional con colas BullMQ + Redis, templates Handlebars compilados con Maizzle (Tailwind CSS), y fallback síncrono si Redis no disponible."
---

# Communications — Comunicaciones y Email

> [!info] Resumen
> Módulo de comunicaciones que agrupa **Home** (health check), **Mail** (emails transaccionales), y **Email Queue** (entrega asíncrona vía BullMQ + Redis con fallback síncrono). Templates de email compilados con **Maizzle** (Tailwind CSS para email). Ubicado en `apps/back/src/modules/communications/`.

## Estructura

```
communications/
├── comms.module.ts            # Root: imports HomeModule + MailModule
├── home/
│   ├── home.module.ts
│   ├── home.controller.ts     # GET / → appInfo
│   └── home.service.ts
├── mail/
│   ├── mail.module.ts         # Imports ConfigModule, MailerModule, EmailQueueModule
│   ├── mail.service.ts        # Alto nivel: userSignUp, forgotPassword, confirmNewEmail
│   ├── config/                # MailConfig type
│   ├── helpers/               # mail-template-path.helper.ts
│   ├── interfaces/            # MailData interface
│   └── mail-templates/
│       ├── emails/            # activation.hbs, reset-password.hbs, confirm-new-email.hbs
│       └── layouts/           # main.hbs (layout base)
└── email-queue/
    ├── email-queue.module.ts  # @Global(), DynamicModule con .register()
    ├── email.service.ts       # Encola jobs al queue `email`
    ├── email.processor.ts     # BullMQ Worker: compila Handlebars → envía via nodemailer
    └── queued-mailer.service.ts  # Wrapper: si Redis → queue; sino → MailerService directo
```

## Home Endpoint

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | `appInfo()` — Retorna nombre de la app (health check) |

## MailService — Métodos de Alto Nivel

| Método | Template | Descripción |
|--------|----------|-------------|
| `userSignUp(mailData)` | `activation.hbs` | Email de activación de cuenta. Incluye hash JWT de confirmación. i18n según idioma del usuario |
| `forgotPassword(mailData)` | `reset-password.hbs` | Email de reset de contraseña. Incluye hash JWT |
| `confirmNewEmail(mailData)` | `confirm-new-email.hbs` | Confirmación de cambio de email |
| `invoicePaymentConfirmed(mailData)` | (directo) | Email con factura PDF adjunta. **NO usa cola** (síncrono) |

## Sistema de Colas — Email Queue

### Arquitectura

```
MailService.send()
    │
    ▼
QueuedMailerService
    │
    ├── Redis disponible?
    │   ├── SÍ → EmailService.enqueue() → BullMQ → EmailProcessor → nodemailer
    │   └── NO → MailerService.send() directo (síncrono)
```

### Configuración
- **Redis**: Si `WORKER_HOST` está definido → BullMQ
- **Fallback**: Si no hay Redis → `MailerService` síncrono directo
- **Retries**: 3 intentos con backoff exponencial
- **Queue name**: `email`

### EmailJobData Interface
```typescript
interface EmailJobData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  templatePath?: string;   // Ruta al .hbs
  context?: Record<string, any>;  // Variables del template
  attachments?: Attachment[];
  from?: string;
}
```

## Templates de Email — Maizzle + Handlebars

Foundation usa **Maizzle** para compilar templates Tailwind CSS a HTML compatible con clientes de email.

```
mail-templates/
├── src/
│   ├── emails/              # Templates fuente (Tailwind)
│   │   ├── activation.html
│   │   ├── reset-password.html
│   │   └── confirm-new-email.html
│   └── layouts/
│       └── main.html
└── build/
    ├── activation.hbs       # Compilado (Handlebars)
    ├── reset-password.hbs
    └── confirm-new-email.hbs
```

**Workflow**: `pnpm maizzle:build` compila `src/` → `build/*.hbs`

## MailerService — Capa Baja

Wrapper de **Nodemailer**:
- Compilación de Handlebars con contexto
- Soporte para attachments
- Configuración SMTP desde `mail.config.ts`
- Usado directamente por `QueuedMailerService` y `EmailProcessor`

## Dependencias

- `ConfigModule` — `mail.config.ts` (SMTP host, port, user, password, from)
- `BullMQ` + `Redis` — Cola de emails (opcional)
- `Nodemailer` — Transporte SMTP
- `Handlebars` — Templates de email
- `Maizzle` — Build-time: Tailwind CSS → HTML email

## Relaciones

- [[Foundation/Modulos/index|Módulos Backend]] — Índice de módulos
- [[Foundation/Modulos/IAM - Identity y Access Management|IAM]] — Emails de auth (activación, reset)
- [[Foundation/Extensiones/Stripe - Integracion de Pagos|Stripe]] — Emails de factura
- [[Foundation/Infraestructura - Base de Datos y Utilidades|Infraestructura]] — MailerService en infra
