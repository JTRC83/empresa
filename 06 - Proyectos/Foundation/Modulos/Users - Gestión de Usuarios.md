---
title: "Users — Gestión de Usuarios"
date: 2026-06-02
tags:
  - backend
  - nestjs
  - users
  - crud
  - typeorm
  - soft-delete
description: "Módulo de gestión de usuarios de Foundation. CRUD completo con fotos de perfil polimórficas, estados activo/inactivo, soft delete, y arquitectura hexagonal con repositorio aislado."
---

# Users — Gestión de Usuarios

> [!info] Resumen
> Módulo CRUD de usuarios con soporte de fotos de perfil polimórficas (via sistema de archivos), estados activo/inactivo, y soft delete. Sigue arquitectura hexagonal con `UserPersistenceModule` aislado. Solo accesible por admin (JWT + rol admin). Ubicado en `apps/back/src/modules/users/`.

## Estructura

```
users/
├── users.module.ts            # Importa UserPersistenceModule + FilesModule
├── users.controller.ts        # 7 endpoints (todos requieren admin)
├── users.service.ts           # CRUD + upload foto + resolve photo
├── domain/
│   └── user.ts                # Interfaz User (id, email, password [@Exclude], provider, socialId, firstName, lastName, photo [FileType], role, status, stripeCustomerId, language, timestamps)
├── dto/
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   ├── find-all-user.dto.ts
│   ├── find-all-user-paginated.dto.ts
│   └── user.dto.ts
├── infrastructure/
│   ├── persistence.module.ts  # TypeORM forFeature + UserRepository provider
│   ├── user.repository.ts     # Extiende EntityRelationalHelper
│   └── entities/
│       └── user.entity.ts     # Tabla `user`, @DeleteDateColumn
└── statuses/
    ├── statuses.enum.ts       # active=1, inactive=2
    └── infrastructure/
        └── entities/
            └── status.entity.ts
```

## Endpoints — UsersController (`/users`, v1)

Todos requieren **JWT + admin** (`@AdminAuth()`):

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/` | `create(dto)` — Crear usuario. Valida email único, hashea password |
| `POST` | `/profile-photo` | `uploadProfilePhoto()` — Subir foto de perfil. Multipart, 5MB max, png/jpg/jpeg/webp |
| `GET` | `/` | `findAllWithPagination()` — Paginación infinita con filtros |
| `GET` | `/all` | `findAll()` — Todos sin paginación |
| `GET` | `/:id` | `findOne()` — Buscar por ID |
| `PATCH` | `/:id` | `update(dto)` — Actualizar. Valida email único, hashea password si cambia |
| `DELETE` | `/:id` | `remove()` — Soft delete |

## UsersService — Métodos

| Método | Descripción |
|--------|-------------|
| `create(dto)` | Valida email único, role/status válidos, hashea password con bcrypt |
| `findAll(query)` | Todos sin paginación, con filtros por email/role/status |
| `findAllWithPagination(query)` | Paginación infinita con los mismos filtros |
| `findById(id)` | Por ID, incluye relaciones role + status |
| `findByIds(ids)` | Por array de IDs |
| `findByEmail(email)` | Por email exacto |
| `findBySocialIdAndProvider(socialId, provider)` | Para login social |
| `update(id, dto)` | Valida email único, hashea password si cambia, valida role/status |
| `remove(id)` | Soft delete |
| `updateProfilePhoto(userId, file)` | Borra foto existente → sube nueva via `FILE_UPLOADER_SERVICE` → procesa con `ImageProcessingService` |
| `resolvePhoto(user)` | Resuelve foto polimórficamente via `FilesService.findWithFilters({ entityName: 'user', entityId, context: 'profile' })` |

## Entidades

| Entidad | Tabla | Campos |
|---------|-------|--------|
| `UserEntity` | `user` | id (PK), email (unique), password, provider, socialId, firstName, lastName, stripeCustomerId, role (FK → RoleEntity), status (FK → StatusEntity), language, createdAt, updatedAt, deletedAt (@DeleteDateColumn) |
| `StatusEntity` | `status` | id (1=active, 2=inactive), name |

## Foto de Perfil — Sistema Polimórfico

Las fotos de perfil usan el sistema de archivos polimórfico de [[Foundation/Modulos/Storage - Sistema de Archivos|Storage]]:

1. `POST /users/profile-photo` → `FileInterceptor` captura el archivo
2. `UsersService.updateProfilePhoto()` → busca foto existente (`entityName: 'user'`, `entityId: userId`, `context: 'profile'`) y la borra
3. Sube nueva foto via `FILE_UPLOADER_SERVICE` (driver local/S3 según config)
4. Procesa con `ImageProcessingService` (Sharp: WebP, max 1920x1080)
5. Al leer usuario, `resolvePhoto()` busca la foto asociada y la incluye en la respuesta

## Dependencias

- `UserPersistenceModule` — TypeORM para UserEntity
- `FilesModule.register()` — Para upload de fotos de perfil
- `ImageProcessingService` — Optimización de imágenes

## Relaciones

- [[Foundation/Modulos/index|Módulos Backend]] — Índice de módulos
- [[Foundation/Modulos/IAM - Identity y Access Management|IAM]] — Consume UsersModule para auth
- [[Foundation/Modulos/Storage - Sistema de Archivos|Storage]] — Fotos de perfil polimórficas
- [[Foundation/Frontend/Auth - Autenticacion Frontend|Auth Frontend]] — Perfil de usuario en frontend
