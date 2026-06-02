---
title: "CMS — Content Management System"
date: 2026-06-02
tags:
  - extension
  - cms
  - blog
  - seo
  - media
  - sitemap
  - content
description: "Extensión CMS de Foundation. Content Management System completo con páginas, blog (posts, categorías, tags), SEO metadata, upload de media, y sitemap dinámico. 68 endpoints, 5 entidades, 16 permisos."
---

# CMS — Content Management System

> [!info] Resumen
> CMS completo implementado como **extensión auto-descubrible**. Incluye gestión de páginas con templates, blog con categorías y tags, metadatos SEO, upload de media con entity linking, y generación dinámica de sitemap. Ubicado en `apps/back/src/extensions/cms/`.

## Estructura

```
extensions/cms/
├── extension.manifest.ts     # name: "cms", v1.0.0, 66 routes, 5 entities, 16 permissions
├── extension.module.ts       # CmsModule: imports Pages, Blog, SEO, Media, Sitemap
├── pages/                    # Páginas CMS
│   ├── pages.module.ts
│   ├── pages.controller.ts   # CRUD + public + preview + publish + reorder
│   ├── pages.service.ts
│   ├── dto/
│   └── infrastructure/       # PageEntity (ext_cms_page)
├── blog/
│   ├── blog.module.ts
│   ├── posts/                # Blog posts
│   │   ├── posts.controller.ts  # CRUD + public + preview + publish + featured-image
│   │   ├── posts.service.ts
│   │   └── infrastructure/   # BlogPostEntity (ext_cms_blog_post)
│   ├── categories/           # Categorías del blog
│   │   ├── categories.controller.ts  # CRUD + reorder
│   │   └── infrastructure/   # BlogCategoryEntity (ext_cms_blog_category)
│   └── tags/                 # Tags
│       ├── tags.controller.ts  # CRUD + public
│       └── BlogTagEntity (ext_cms_post_tag)
├── seo/
│   ├── seo.module.ts
│   ├── seo.controller.ts     # GET por pageId/entityName, PATCH
│   ├── seo.service.ts
│   └── infrastructure/       # SeoMetadataEntity (ext_cms_seo_metadata)
├── media/
│   ├── media.module.ts
│   ├── media.controller.ts   # GET, POST upload con entity linking
│   └── media.service.ts
└── sitemap/
    ├── sitemap.module.ts
    ├── sitemap.controller.ts # GET /blog, GET /pages
    └── sitemap.service.ts
```

## Manifiesto

```typescript
{
  name: "cms",
  version: "1.0.0",
  contributes: {
    routes: 66,
    entities: 5,         // Page, BlogPost, BlogCategory, Tag, SeoMetadata
    seeds: true,
    menuItems: [
      {
        heading: "Content",
        items: [
          { title: "Pages", to: "/admin/cms/pages", icon: "FileText" },
          { title: "Blog Posts", to: "/admin/cms/blog", icon: "Newspaper" },
          { title: "Categories", to: "/admin/cms/categories", icon: "FolderTree" },
          { title: "Tags", to: "/admin/cms/tags", icon: "Tags" },
          { title: "Media", to: "/admin/cms/media", icon: "Image" },
        ]
      }
    ],
    permissions: 16       // page:create/read/update/delete/publish, blog:create/read/update/delete/publish, etc.
  }
}
```

## Submódulos

### Pages — Páginas CMS

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /cms/pages` | Admin | Listar todas (paginado) |
| `POST /cms/pages` | Admin | Crear página |
| `GET /cms/pages/:id` | Admin | Ver página |
| `PATCH /cms/pages/:id` | Admin | Actualizar página |
| `DELETE /cms/pages/:id` | Admin | Eliminar página |
| `GET /cms/pages/public` | Public | Páginas publicadas |
| `GET /cms/pages/public/:slug` | Public | Página por slug |
| `POST /cms/pages/:id/preview` | Admin | Vista previa |
| `POST /cms/pages/:id/publish` | Admin | Publicar |
| `POST /cms/pages/reorder` | Admin | Reordenar páginas |

**Templates soportados**: `landing`, `generic`, `contact`

**Entidad `PageEntity`** (`ext_cms_page`): id, title, slug, content (TipTap HTML), template, isPublished, publishedAt, seoMetadata (FK), order, timestamps, traducciones dinámicas.

### Blog

#### Posts

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /cms/blog/posts` | Admin | Listar (paginado, filtro por categoría) |
| `POST /cms/blog/posts` | Admin | Crear post |
| `GET /cms/blog/posts/:id` | Admin | Ver post |
| `PATCH /cms/blog/posts/:id` | Admin | Actualizar post |
| `DELETE /cms/blog/posts/:id` | Admin | Eliminar post |
| `GET /cms/blog/posts/public` | Public | Posts publicados |
| `GET /cms/blog/posts/public/:slug` | Public | Post por slug |
| `POST /cms/blog/posts/:id/preview` | Admin | Vista previa |
| `POST /cms/blog/posts/:id/publish` | Admin | Publicar |
| `POST /cms/blog/posts/:id/featured-image` | Admin | Upload imagen destacada |

**Entidad `BlogPostEntity`** (`ext_cms_blog_post`): id, title, slug, excerpt, content (TipTap HTML), featuredImage (FileEntity polimórfico), category (FK), tags (M:N), isPublished, publishedAt, seoMetadata (FK), timestamps.

#### Categories

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /cms/blog/categories` | Admin | Listar |
| `POST /cms/blog/categories` | Admin | Crear |
| `PATCH /cms/blog/categories/:id` | Admin | Actualizar |
| `DELETE /cms/blog/categories/:id` | Admin | Eliminar |
| `POST /cms/blog/categories/reorder` | Admin | Reordenar |

#### Tags

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /cms/blog/tags` | Admin | Listar |
| `POST /cms/blog/tags` | Admin | Crear |
| `PATCH /cms/blog/tags/:id` | Admin | Actualizar |
| `DELETE /cms/blog/tags/:id` | Admin | Eliminar |

### SEO

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /cms/seo` | Admin | Buscar por pageId o entityName+entityId |
| `PATCH /cms/seo` | Admin | Crear o actualizar metadatos |

**Entidad `SeoMetadataEntity`** (`ext_cms_seo_metadata`): id, entityName, entityId, metaTitle, metaDescription, metaKeywords, ogTitle, ogDescription, ogImage, ogType, twitterCard, canonicalUrl, robots, jsonLd.

### Media

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /cms/media` | Admin | Listar archivos subidos |
| `POST /cms/media/upload` | Admin | Upload con entity linking |

### Sitemap

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /cms/sitemap/pages` | Public | Sitemap de páginas |
| `GET /cms/sitemap/blog` | Public | Sitemap de blog posts |

## Entidades (5)

| Entidad | Tabla | Prefijo |
|---------|-------|---------|
| `PageEntity` | `ext_cms_page` | `ext_cms_` |
| `BlogPostEntity` | `ext_cms_blog_post` | `ext_cms_` |
| `BlogCategoryEntity` | `ext_cms_blog_category` | `ext_cms_` |
| `PostTagEntity` | `ext_cms_post_tag` | `ext_cms_` |
| `SeoMetadataEntity` | `ext_cms_seo_metadata` | `ext_cms_` |

> [!tip] Por convención, las entidades de extensiones usan el prefijo `ext_<nombre>_` para evitar conflictos con módulos core.

## Workflow de Publicación

1. **Draft**: Contenido creado con `isPublished: false`
2. **Preview**: `POST /:id/preview` — retorna contenido sin necesidad de publicar
3. **Publish**: `POST /:id/publish` — setea `isPublished: true`, `publishedAt: now()`
4. **Public endpoints**: Solo retornan contenido con `isPublished: true`

## Traducciones Dinámicas

Las páginas y posts del CMS usan el sistema de [[Foundation/Modulos/Translations - Internacionalizacion|Translations]] para contenido multilingüe:

```
GET /translations/dynamic/:lang/:entityName/:entityId
```

Ejemplo: `GET /translations/dynamic/en/ext_cms_page/123` → traducciones de la página 123 en inglés.

## Dependencias

- **FilesModule** (Storage) — Para upload de media y featured images
- **TranslationsModule** — Para traducciones dinámicas de contenido
- **TypeORM** — 5 entidades propias

## Relaciones

- [[Foundation/Extensiones/index|Extensiones]] — Índice de extensiones
- [[Foundation/Extensiones/Sistema de Extensiones|Sistema de Extensiones]] — Cómo se carga CMS
- [[Foundation/Modulos/Translations - Internacionalizacion|Translations]] — Traducciones dinámicas
- [[Foundation/Modulos/Storage - Sistema de Archivos|Storage]] — Upload de media
- [[Foundation/Frontend/index|Frontend]] — Consume APIs del CMS
