---
title: "Core — Sistema de Núcleo"
date: 2026-06-02
tags:
  - backend
  - core
  - nestjs
  - extension-loader
  - config
  - infrastructure
description: "Sistema de núcleo de Foundation. Extension Loader, Foundation Module, Infrastructure Module, config factories, y utilidades compartidas del backend."
---

# Core — Sistema de Núcleo

> [!info] Resumen
> El sistema de núcleo (`apps/back/src/core/`) contiene los mecanismos de orquestación de Foundation: el **Extension Loader** (auto-discovery de extensiones), el **Foundation Module** (agregador de todos los feature modules), y el **Infrastructure Module** (TypeORM, i18n, scheduling, archivos estáticos). También incluye el sistema de configuración (`apps/back/src/config/`) y las utilidades de infraestructura (`apps/back/src/infrastructure/`).

## Core — Extension System

Documentado en detalle en [[Foundation/Extensiones/Sistema de Extensiones|Sistema de Extensiones]].

| Archivo | Propósito |
|---------|-----------|
| `extension-loader.ts` | DynamicModule. Pipeline de 5 fases: scan → manifests → conflicts → deps → load |
| `extension-manifest.types.ts` | Interfaces TypeScript para ExtensionManifest, ConflictReport, RouteContribution |
| `extension-conflict-detector.ts` | `detectConflicts()`: rutas duplicadas, tablas duplicadas, dependencias faltantes |
| `extension-dependency-resolver.ts` | Kahn's algorithm para topological sort + detección de ciclos DFS |
| `config-loader.ts` | `discoverExtensionConfigs()`: auto-descubre `extension.config.ts` |
| `seed-loader.ts` | `ExtensionSeedLoaderModule`: descubre y ejecuta seeds de extensiones |

## Foundation Module

```typescript
// core/foundation.module.ts
@Module({
  imports: [
    // Feature modules (core)
    IamModule,
    UsersModule,
    StorageModule.register(),
    CommsModule,
    BillingModule,

    // Extensiones (auto-descubiertas)
    ExtensionLoaderModule.register(),

    // Opcionales (configurables)
    ...(config.translations ? [TranslationsModule] : []),
    ...(config.errorTracker ? [ErrorTrackerModule] : []),
  ],
})
export class FoundationModule {}
```

Este es el **punto central de ensamblaje**. Agregar o quitar features es modificar este archivo — las extensiones se agregan solas.

## Infrastructure Module

```typescript
// core/infrastructure.module.ts
@Module({
  imports: [
    // Scheduling
    ScheduleModule.forRoot(),

    // Archivos estáticos
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),

    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig, authConfig, databaseConfig, mailConfig,
        fileConfig, googleConfig, facebookConfig, appleConfig,
        stripeConfig, workerConfig,
        ...discoverExtensionConfigs(),  // Extension configs auto-descubiertas
      ],
    }),

    // Base de datos
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),

    // i18n
    I18nModule.forRootAsync({
      useFactory: (config: AppConfig) => ({
        fallbackLanguage: config.fallbackLanguage,
        resolvers: [new HeaderResolver(['x-lang'])],
      }),
    }),
  ],
})
export class InfrastructureModule {}
```

## Config — Sistema de Configuración

### Config Factories (10)

| Archivo | Namespace | Variables clave |
|---------|-----------|----------------|
| `app.config.ts` | `app` | nodeEnv, name, frontendDomain, backendDomain, port, apiPrefix, fallbackLanguage, openRouterApiKey, translationModel, bunnyCdnUrl |
| `auth.config.ts` | `auth` | secret, expires, refreshSecret, refreshExpires, forgotSecret, forgotExpires, confirmEmailSecret, confirmEmailExpires |
| `database.config.ts` | `database` | type, host, port, username, password, name, synchronize, maxConnections, ssl* |
| `file.config.ts` | `file` | driver (local/s3/s3-presigned/b2), accessKeyId, secretAccessKey, awsS3Bucket, maxFileSize, imageOptimization |
| `mail.config.ts` | `mail` | host, port, user, password, defaultEmail, defaultName, ignoreTLS, secure |
| `worker.config.ts` | `worker` | host, port, db, username, password, enabled |
| `google.config.ts` | `google` | clientId, clientSecret |
| `facebook.config.ts` | `facebook` | appId, appSecret |
| `apple.config.ts` | `apple` | appAudience |
| `stripe.config.ts` | `stripe` | secretKey, webhookSecret, publicKey |

Cada factory usa `registerAs('namespace', () => validateConfig(ConfigClass, process.env))` con class-validator.

### Tipo Global

```typescript
// config/config.type.ts
export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  file: FileConfig;
  mail: MailConfig;
  worker: WorkerConfig;
  google: GoogleConfig;
  facebook: FacebookConfig;
  apple: AppleConfig;
  stripe: StripeConfig;
};
```

## Infraestructura — Utilidades Compartidas

### Database

| Archivo | Propósito |
|---------|-----------|
| `typeorm-config.service.ts` | `TypeOrmOptionsFactory`. Entity glob: `**/*.entity{.ts,.js}`. Soporta SSL |
| `data-source.ts` | DataSource para TypeORM CLI (migraciones) |
| `database.config.ts` | Validación de variables de entorno con class-validator |

**Entity Discovery**: TypeORM descubre automáticamente entidades de módulos Y extensiones via glob pattern:
```typescript
entities: [__dirname + '/../../**/*.entity{.ts,.js}']
```

### Migraciones

`infrastructure/database/migrations/` — 6 migraciones generadas con `typeorm migration:generate`.

### Seeds

| Archivo | Propósito |
|---------|-----------|
| `seed.module.ts` | Módulo de seeds |
| `run-seed.ts` | Script de ejecución (`pnpm seed:run`) |
| `role/` | Seed de roles (admin, customer) |
| `status/` | Seed de estados (active, inactive) |
| `user/` | Seed de usuario admin inicial |

### Mailer

| Archivo | Propósito |
|---------|-----------|
| `mailer.module.ts` | Provee `MailerService` |
| `mailer.service.ts` | Wrapper de Nodemailer con compilación Handlebars |

### Utilidades

| Archivo | Propósito |
|---------|-----------|
| `infinity-pagination.ts` | Helper de paginación infinita: `{ total, per_page, current_page, last_page, hasNextPage, first/last/next/prev_page_url, data }` |
| `parse-filter.ts` | Convierte query string → objeto filtro |
| `serializer.interceptor.ts` | Entidad → DTO (con resolución de promesas anidadas) |
| `slugify.ts` | Generación de slugs |
| `validate-config.ts` | Validación de configuración con class-validator |
| `deep-resolver.ts` | Resolución profunda de objetos |
| `relational-entity-helper.ts` | Clase base para todas las entidades TypeORM |
| `lower-case.transformer.ts` | Transformer de columna TypeORM (lowercase) |
| `is-entity-table.validator.ts` | Valida que el entityName corresponda a una tabla real |

### Tipos Compartidos

| Tipo | Descripción |
|------|-------------|
| `DeepPartial<T>` | Parcial profundo recursivo |
| `Maybe<T>` | `T \| undefined` |
| `Nullable<T>` | `T \| null` |
| `OrNever<T>` | `T \| never` |
| `PaginationOptions` | `{ page, limit, route }` |
| `InfinityPaginationResponseDto<T>` | DTO de respuesta paginada |

## Relaciones

- [[Foundation/index|Foundation]] — Índice general
- [[Foundation/Modulos/index|Módulos Backend]] — Módulos cargados por FoundationModule
- [[Foundation/Extensiones/index|Extensiones]] — Sistema de extensiones
