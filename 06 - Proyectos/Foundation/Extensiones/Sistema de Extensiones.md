---
title: "Sistema de Extensiones — Foundation"
date: 2026-06-02
tags:
  - extensiones
  - plugins
  - auto-discovery
  - manifiestos
  - dependency-resolution
  - conflict-detection
description: "Arquitectura completa del sistema de extensiones auto-descubribles de Foundation. Pipeline de 5 fases: discovery, manifiestos, conflict detection, dependency resolution, y carga de módulos. Ciclo de vida completo desde creación hasta distribución."
---

# Sistema de Extensiones

> [!info] Resumen
> Foundation implementa un sistema de **extensiones drop-in auto-descubribles**. Agregar una extensión es copiar una carpeta a `extensions/` — sin modificar el core. El sistema detecta, valida (conflictos de rutas/tablas/dependencias), resuelve orden de carga (topological sort), y registra automáticamente módulos, controladores, entidades y seeds.

## Pipeline de Carga — 5 Fases

El `ExtensionLoaderModule.register()` ejecuta este pipeline al iniciar la app:

```
Fase 1: Directory scan      → Lee extensions/*/
Fase 2: Manifest loading    → require() extension.manifest.ts → Map<name, manifest>
Fase 3: Conflict detection  → Route conflicts, table conflicts, missing deps
Fase 4: Dependency resolve   → Kahn's algorithm topological sort
Fase 5: Module loading       → require() extension.module.ts → NestJS DynamicModule
```

### Fase 1 — Directory Scan

Escanea `apps/back/src/extensions/`. Cada subdirectorio es una extensión candidata.

### Fase 2 — Manifest Loading

Para cada extensión, intenta `require()` el archivo compilado `extension.manifest.js`. Si el objeto exportado tiene `name` + `version`, se registra. Extensiones **sin manifiesto** se cargan por retrocompatibilidad (legacy path).

### Fase 3 — Conflict Detection

`detectConflicts(manifests)` agrega tres chequeos:

| Chequeo | Severidad | Descripción |
|---------|-----------|-------------|
| **Route conflicts** | ERROR | Dos extensiones con mismo `method:path`. Bloquea carga |
| **Table conflicts** | ERROR | Dos extensiones con mismo nombre de tabla. Bloquea carga |
| **Missing dependencies** | ERROR | Extensión depende de otra que no existe. Bloquea carga |

> [!danger] Errores de conflicto **bloquean TODA carga de extensiones**. El loader retorna un DynamicModule vacío.

### Fase 4 — Dependency Resolution

`resolveDependencies(manifests)` usa **algoritmo de Kahn** (topological sort):

1. Construye grafo de adyacencia desde `dependencies.extensions[]`
2. Calcula in-degree de cada nodo
3. Procesa nodos con in-degree 0 (sin dependencias)
4. Reduce in-degrees iterativamente y agrega al resultado
5. **Detección de ciclos**: Si `sorted < total`, ejecuta DFS para encontrar cadena cíclica (ej: `a → b → c → a`). Extensiones cíclicas se agregan al final con warning.

**Orden de carga**: dependencias primero. Ej: `stripe → cms` (cms depende de stripe).

### Fase 5 — Module Loading

Extensiones cargadas en orden topológico:
1. Manifestadas primero
2. Legacy (sin manifiesto) después
3. Cada `extension.module.js` se `require()`a
4. Se busca clase NestJS con "Module" en el nombre
5. Se agregan al `imports[]` del DynamicModule

## Estructura de una Extensión

```
extensions/<nombre>/
├── extension.module.ts       # NestJS Module (OBLIGATORIO)
├── extension.manifest.ts     # Metadata: rutas, entidades, permisos (RECOMENDADO)
├── extension.config.ts       # Config factories (opcional)
├── *.controller.ts           # Endpoints REST
├── *.service.ts              # Lógica de negocio
├── domain/                   # Objetos de dominio
├── dto/                      # Request/Response DTOs
├── infrastructure/           # TypeORM entities, repositories
├── config/                   # Config types
├── middleware/                # Guards, interceptors
└── seeds/                    # Seed data (opcional)
    ├── <name>-seed.module.ts
    └── <name>-seed.service.ts
```

### Archivo Obligatorio: `extension.module.ts`

```typescript
// La clase DEBE contener "Module" en el nombre (case-insensitive)
// El archivo DEBE llamarse extension.module.ts
@Module({
  imports: [/* TypeORM entities, otros módulos */],
  controllers: [MiFeatureController],
  providers: [MiFeatureService],
})
export class MiFeatureModule {}
```

### Archivo Recomendado: `extension.manifest.ts`

```typescript
const manifest: ExtensionManifest = {
  name: "mi-feature",
  version: "1.0.0",
  displayName: "Mi Feature",
  description: "Descripción de la feature",
  dependencies: {
    extensions: ["stripe"],  // Si depende de otra extensión
  },
  contributes: {
    routes: [
      { method: "GET", path: "/api/v1/mi-feature" },
      { method: "POST", path: "/api/v1/mi-feature" },
    ],
    entities: [
      { name: "MiEntidad", table: "ext_mi_feature_entidad" },
    ],
    seeds: true,
    config: ["miFeature"],
    menuItems: [
      {
        heading: "Mi Feature",
        items: [
          { title: "Dashboard", to: "/app/mi-feature", icon: "LayoutDashboard" },
        ],
      },
    ],
    permissions: [
      { action: "mi-feature:read", description: "Ver datos" },
      { action: "mi-feature:write", description: "Modificar datos" },
    ],
  },
};

export default manifest;
```

## Ciclo de Vida Completo

### Creación

```bash
# Opción A: Hygen generator
pnpm generate:extension → prompts → genera CRUD completo

# Opción B: Manual
mkdir -p apps/back/src/extensions/mi-feature/
# Crear extension.module.ts + extension.manifest.ts + código
```

### Instalación (desde ZIP o local)

```bash
bin/add-extension.js <nombre> [zip-path]
```

1. Extrae ZIP (si se provee) o usa `extensions/<nombre>/`
2. Lee y valida `extension.manifest.ts` (name, version)
3. Verifica dependencias contra extensiones instaladas
4. Copia `backend/` → `apps/back/src/extensions/<nombre>/`
5. Copia `frontend/` → `apps/front/modules/<nombre>/`
6. Genera migración: `Add<Nombre>Extension`
7. Ejecuta seeds si existen
8. Actualiza `nuxt.config.ts` (extends + alias)

### Distribución (build)

```bash
bin/build-extension.js <nombre> [version]
```

1. Lee manifiesto para versión
2. Crea dir temporal con `extension.manifest.ts`, `extension.json`, `backend/`, `frontend/`, `README.md`
3. Empaqueta como `<nombre>-v<version>.zip` en `dist/`

### Bundling (extensión padre + hijos)

```bash
bin/create-bundle.ts <nombre>
```

1. Escanea todas las extensiones por `parent` metadata
2. Recolecta recursivamente todos los descendientes
3. Copia padre + hijos + manifiestos en un ZIP
4. Crea `bundle.json` metadata
5. Output: `dist/<nombre>-bundle-v<version>.zip`

### Eliminación

```bash
bin/remove-extension.js <nombre>
```

1. Verifica que la extensión existe
2. Verifica que ninguna otra extensión depende de ella
3. Verifica hijos (parent metadata) — advierte, `--force` para proceder
4. Elimina `apps/back/src/extensions/<nombre>/`
5. Elimina `apps/front/modules/<nombre>/`
6. Genera migración: `Remove<Nombre>Extension`
7. Limpia `nuxt.config.ts`

## Core System — Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `core/extension-loader.ts` | Pipeline de 5 fases. DynamicModule que auto-descubre y registra extensiones |
| `core/extension-manifest.types.ts` | Interfaces TypeScript: ExtensionManifest, RouteContribution, EntityContribution, etc. |
| `core/extension-conflict-detector.ts` | Detecta conflictos de rutas, tablas y dependencias faltantes |
| `core/extension-dependency-resolver.ts` | Kahn's algorithm + detección de ciclos DFS |
| `core/config-loader.ts` | `discoverExtensionConfigs()` — auto-descubre `extension.config.ts` |
| `core/seed-loader.ts` | `ExtensionSeedLoaderModule` — descubre y ejecuta seeds de extensiones |

### Tooling CLI

| Script | Propósito |
|--------|-----------|
| `bin/add-extension.js` | Instalar extensión desde ZIP o local |
| `bin/remove-extension.js` | Desinstalar con verificación de dependencias |
| `bin/build-extension.js` | Empaquetar extensión para distribución |
| `bin/create-bundle.ts` | Bundle recursivo (padre + hijos) |
| `bin/ext-validate.ts` | Validar integridad de relaciones parent |
| `bin/ext-tree.ts` | Visualizar árbol ASCII de jerarquía parent-child |

### Tests

| Archivo | Qué prueba |
|---------|-----------|
| `core/ext-validate.spec.ts` | Validación de parent (not_found, not_in_deps, cycle) |
| `core/ext-tree.spec.ts` | Construcción y renderizado de árbol |
| `core/create-bundle.spec.ts` | Bundling recursivo |

## Relaciones

- [[Foundation/Extensiones/index|Extensiones]] — Índice de extensiones
- [[Foundation/Extensiones/CMS - Content Management System|CMS]] — Extensión CMS
- [[Foundation/Extensiones/Stripe - Integracion de Pagos|Stripe]] — Extensión Stripe
- [[Foundation/Core - Sistema de Núcleo|Core]] — Donde vive el Extension Loader
- [[Foundation/Modulos/index|Módulos Backend]] — Features core vs extensiones
