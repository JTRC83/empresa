---
title: "Infraestructura — Base de Datos y Utilidades"
date: 2026-06-02
tags:
  - backend
  - infraestructura
  - typeorm
  - database
  - migraciones
  - seeds
  - docker
description: "Infraestructura de Foundation: configuración de TypeORM, migraciones, seeds, sistema de email (Nodemailer), y utilidades compartidas del backend."
---

# Infraestructura — Base de Datos y Utilidades

> [!info] Resumen
> La capa de infraestructura de Foundation incluye la configuración de TypeORM (con entity discovery automático para módulos y extensiones), sistema de migraciones, seeds iniciales, y servicios de infraestructura como el Mailer. Todo vive en `apps/back/src/infrastructure/`.

## TypeORM — Base de Datos

### Configuración

```typescript
// typeorm-config.service.ts
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.name,
      synchronize: config.synchronize,       // false en producción
      maxConnections: config.maxConnections,
      ssl: config.sslEnabled ? { rejectUnauthorized: false } : false,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],  // Glob: módulos + extensiones
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    };
  }
}
```

### Entity Discovery Global

El patrón glob `**/*.entity{.ts,.js}` descubre automáticamente entidades de:
- `modules/**/*.entity.ts` — Módulos core
- `extensions/**/*.entity.ts` — Extensiones

**No se requiere registro manual** de entidades. Cualquier archivo `.entity.ts` en el proyecto es detectado.

### Migraciones

```
infrastructure/database/migrations/
├── 1710000000000-InitialMigration.ts
├── 1710000000001-AddApiKeys.ts
├── 1710000000002-AddSessions.ts
├── 1710000000003-AddErrorTracker.ts
├── 1710000000004-AddTranslationsModule.ts
└── ...
```

Comandos:
```bash
pnpm migration:generate <name>    # Auto-diff contra DB actual
pnpm migration:run                # Ejecutar migraciones pendientes
pnpm migration:revert             # Revertir última migración
```

### Seeds

```
infrastructure/database/seeds/
├── seed.module.ts              # Módulo raíz de seeds
├── run-seed.ts                 # Script de ejecución
├── role/
│   ├── role-seed.module.ts
│   └── role-seed.service.ts    # Inserta roles: admin (1), customer (2)
├── status/
│   ├── status-seed.module.ts
│   └── status-seed.service.ts  # Inserta estados: active (1), inactive (2)
└── user/
    ├── user-seed.module.ts
    └── user-seed.service.ts    # Inserta usuario admin inicial
```

```bash
pnpm seed:run    # Ejecuta todos los seeds
```

### Patrón de Seeds en Extensiones

Las extensiones pueden tener sus propios seeds en `extensions/<name>/seeds/`. Se auto-descubren via `ExtensionSeedLoaderModule` (ver [[Foundation/Extensiones/Sistema de Extensiones|Sistema de Extensiones]]).

## Docker Compose

Foundation incluye `docker-compose.yml` en la raíz con servicios de infraestructura:

```yaml
services:
  postgres:
    image: postgres:17.4-alpine
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
    environment:
      POSTGRES_DB: foundation
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  mailpit:
    image: axllent/mailpit
    ports:
      - "8025:8025"    # UI web
      - "1025:1025"    # SMTP

  backend:
    build: ./apps/back
    ports: ["3001:3001"]
    depends_on: [postgres, redis]
    # ... env vars

  frontend:
    build: ./apps/front
    ports: ["3000:3000"]
    depends_on: [backend]
```

### Mailpit

**Mailpit** captura todos los emails salientes en desarrollo. Accesible en `http://localhost:8025`. No se envían emails reales — perfecto para testing.

## Scripts de Desarrollo

```bash
# Root (monorepo)
pnpm dev              # Turbo: backend + frontend en paralelo
pnpm build            # Turbo build
pnpm lint             # Turbo lint
pnpm check-types      # Turbo type check

# Backend
pnpm migration:generate <name>
pnpm migration:run
pnpm seed:run
pnpm generate:resource     # Hygen: scaffold CRUD module
pnpm generate:extension    # Hygen: scaffold extension
pnpm add:property          # Agregar campo a recurso
pnpm translation:add       # CLI interactivo de traducciones
pnpm maizzle:build         # Compilar email templates
pnpm test                  # Jest

# Frontend
pnpm dev                   # Nuxt dev server
```

## Relaciones

- [[Foundation/index|Foundation]] — Índice general
- [[Foundation/Core - Sistema de Núcleo|Core]] — InfrastructureModule que usa esta capa
- [[Foundation/Modulos/index|Módulos Backend]] — Módulos que usan TypeORM
- [[Foundation/Extensiones/index|Extensiones]] — Extensiones que usan entity discovery global
- [[Foundation/Modulos/Communications - Comunicaciones y Email|Communications]] — Mailer en infraestructura
