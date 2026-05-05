---
title: "Valor Balear"
tags:
  - proyecto
  - producto
  - marketplace
  - baleares
  - productos-locales
  - gastronomía
  - artesanía
  - multi-vendor
  - sendcloud
  - stripe-connect
  - webhooks
  - e-commerce
  - som-u
  - ecosistema
category: proyecto
url: ""
code_path: ""
status: planificación
---

# Valor Balear

> [!info] Visión general
> **Valor Balear** es un marketplace de productos locales auténticos de las Islas Baleares. Conecta artesanos y productores baleares con clientes de toda España, permitiendo descubrir y comprar productos de gastronomía y artesanía que transmiten la cultura balear. Los negocios solo se preocupan de crear valor con su producto; la plataforma se encarga del resto.

## Concepto

Los productos baleares están **desconectados** de las redes sociales y del alcance digital. Gente de fuera de las islas no llega a estos productos. Valor Balear resuelve esto creando un marketplace exclusivo donde:

- Se venden **productos auténticos de aquí**, para que los clientes se impregnen de la cultura
- No es "otro marketplace más" — es el canal de ventas de los productos baleares
- Los negocios solo se preocupan de **generar valor con el producto**
- La plataforma se encarga de **visibilidad, logística, pagos y tecnología**

## Categorías

| Categoría | Ejemplos |
|-----------|----------|
| **Gastronomía** | Ensaimadas, sobrasada, quesos, vinos, hierbas, aceite, dulces tradicionales |
| **Artesanía** | Cerámica, joyería tradicional, textiles, cuero, madera, vidrio |

> [!note] Scope del MVP
> La Fase 1 se enfoca en **productos físicos locales auténticos** (gastronomía y artesanía). Servicios, cursos y eventos se incorporan en fases posteriores como expansión natural del marketplace (ver [[#Fase 6 — Servicios, Cursos y Eventos autóctonos|Fase 6]]).

## Monetización

**Modelo: Porcentaje de comisión por venta**

- El cliente paga el precio del producto + envío
- Stripe Connect hace el split automático:
  - X% → Valor Balear (comisión de la plataforma)
  - Resto → Cuenta del artesano
- Los artesanos no necesitan facturar a la plataforma; el split es automático
- Transparente para el cliente

> [!warning] Ventaja frente a modelo de suscripción
> Con comisión por venta, el artesano solo paga cuando vende. No hay barrera de entrada (setup fee ni mensualidad). Esto facilita la adopción.

## Stack Tecnológico

> [!tip] Construido sobre [[Foundation]]
> Se parte del monorepo Foundation y se añaden las features específicas del marketplace.

### Diagrama de arquitectura

```mermaid
flowchart TB
    subgraph Frontend["🎨 Frontend — Nuxt 4"]
        MP[Marketplace público<br/>SSR + i18n]
        DV[Dashboard vendedor<br/>CRUD + etiquetas + webhooks]
        AD[Admin panel<br/>Gestión + reportes]
    end

    subgraph Backend["⚙️ Backend — NestJS 11"]
        API[API REST]
        ORM[TypeORM 0.3]
        JOBS[BullMQ + Redis<br/>Colas y workers]
    end

    subgraph Externo["🔌 Servicios externos"]
        SC[Stripe Connect<br/>Split de pagos]
        SD[Sendcloud API<br/>Etiquetas + tracking]
        S3[(S3 / Local<br/>File storage)]
    end

    subgraph Datos["💾 Datos"]
        PG[(PostgreSQL 17<br/>Marketplace)]
    end

    Frontend --> API
    API --> ORM
    ORM --> PG
    JOBS --> SD
    JOBS --> SC
    API --> S3
    SC --> JOBS
```

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| **Monorepo** | Turborepo + pnpm | Task runner, gestión de paquetes |
| **Backend** | NestJS 11 + TypeORM 0.3 | API, lógica de negocio, ORM |
| **Base de datos** | PostgreSQL 17 | Datos del marketplace |
| **Frontend** | Nuxt 4 + Vue 3 | SSR, marketplace y dashboard |
| **UI** | Tailwind CSS 4 + DaisyUI 5 | Componentes accesibles y consistentes |
| **Colas / Jobs** | BullMQ + Redis | Webhooks, emails, llamadas asíncronas a Sendcloud |
| **Pagos** | Stripe Connect | Split de pagos multi-vendor |
| **Logística** | Sendcloud API | Etiquetas, tracking, recogidas |
| **Email** | Nodemailer + Maizzle | Transaccionales (pedidos, envíos) |
| **File Storage** | S3 / Local | Fotos de productos, etiquetas PDF |
| **i18n** | @nuxtjs/i18n | Español, catalán, inglés |

## Flujo del Usuario (End-to-End)

### A. Cliente compra
```
Cliente navega /productos
  ↓
Añade ensaimada (Tienda A) + collar cerámica (Tienda B)
  ↓
Carrito agrupa visualmente por tienda
  ↓
Checkout: 1 dirección, 1 pago total
  ↓
Stripe Connect procesa pago
  ↓
Sistema crea 1 Order global + 2 SubOrders
  ↓
Cliente recibe email con OrderID global
  + enlaces de seguimiento separados (Tienda A, Tienda B)
```

### B. Artesano gestiona pedido
```
Artesano entra a /dashboard
  ↓
Ve solo sus SubOrders (nunca ve los de otros)
  ↓
Prepara el paquete
  ↓
Clic "Generar Etiqueta"
  ↓
NestJS llama a Sendcloud:
  • Si Recogida: programa pickup en horario configurado
  • Si Drop-off: solo genera etiqueta PDF
  ↓
Artesano imprime etiqueta y pega en caja
  ↓
Espera al transportista o lleva al punto de entrega
```

### C. Motor de Webhooks
```
NestJS detecta SubOrder_X de Tienda A pagado
  ↓
Job en Redis: disparar webhooks
  ↓
Worker busca URLs configuradas para Tienda A
  ↓
POST a la URL del vendedor con datos del sub-pedido
  ↓
CRM/ERP del vendedor recibe evento y actualiza stock
```

### Diagrama de flujo completo

```mermaid
flowchart TD
    subgraph Cliente["🛒 Cliente"]
        A[Navega /productos] --> B[Añade productos al carrito]
        B --> C[Checkout: 1 dirección, 1 pago]
    end

    subgraph Stripe["💳 Stripe Connect"]
        C --> D[Procesa pago único]
        D --> E[Split automático por tienda]
    end

    subgraph Backend["⚙️ NestJS Backend"]
        E --> F[Crea 1 Order global]
        F --> G[Crea N SubOrders por tienda]
        G --> H[Dispara webhooks]
    end

    subgraph Artesano["📦 Artesano (Tienda A)"]
        G --> I[Ve solo sus SubOrders en /dashboard]
        I --> J[Prepara paquete]
        J --> K[Genera etiqueta vía Sendcloud]
        K --> L[Imprime y pega etiqueta]
    end

    subgraph Sendcloud["🚚 Sendcloud"]
        K --> M{¿Recogida o Drop-off?}
        M -->|Recogida| N[Programa pickup]
        M -->|Drop-off| O[Genera etiqueta PDF]
    end

    subgraph ClienteFinal["📬 Cliente"]
        L --> P[Recibe email con OrderID + tracking]
    end

    subgraph Webhook["🔗 Webhook (Tienda A)"]
        H --> Q[Worker busca URLs de Tienda A]
        Q --> R[POST firmado HMAC al CRM/ERP]
        R --> S[Vendedor actualiza stock]
    end
```

## Arquitectura Multi-Vendor

> [!important] Split por tienda
> Un pedido global se divide obligatoriamente en **sub-pedidos por tienda**. Cada artesano ve solo su sub-pedido. Esto protege la privacidad del cliente y simplifica la logística.

### Diagrama de entidades

```mermaid
erDiagram
    USER ||--o{ STORE : owns
    USER ||--o{ ORDER : places
    STORE ||--o{ PRODUCT : lists
    STORE ||--|| STORE_LOGISTICS : configures
    STORE ||--o{ SUBORDER : receives
    STORE ||--o{ WEBHOOK_ENDPOINT : configures
    ORDER ||--o{ SUBORDER : splits_into
    SUBORDER ||--o{ ORDER_ITEM : contains
    SUBORDER ||--|| SENDCLOUD_PARCEL : generates
    PRODUCT ||--o{ ORDER_ITEM : referenced_by
```

### Entidades clave

#### 1. Usuarios y Tiendas

**User**
- `id`, `email`, `password`, `role` (ADMIN, VENDOR, CUSTOMER)
- `firstName`, `lastName`, `phone`

**Store**
- `id`, `userId` (FK al vendedor)
- `name`, `slug` (URL amigable), `description`
- `story` — historia del artesano (clave para transmitir cultura)
- `logoUrl`, `bannerUrl`
- `address`, `city`, `zipCode`, `island` (Mallorca, Menorca, Ibiza, Formentera)
- `isActive`, `stripeAccountId` (Stripe Connect account)

**StoreLogistics**
- `id`, `storeId` (FK)
- `prefersDropoff` (boolean)
- `pickupTimeStart`, `pickupTimeEnd` (horario de recogida)
- `pickupDays` (array de días disponibles)

#### 2. Catálogo

**Product**
- `id`, `storeId` (FK)
- `name`, `description`, `shortDescription`
- `price` (decimal), `stock` (int)
- `weightGrams` (vital para Sendcloud calcular envío)
- `category` (GASTRONOMY, CRAFTS)
- `subcategory` (ej: SOBRASADA, ENSAIMADA, CERAMICA, JOYERIA)
- `images` (array de URLs)
- `isActive`, `isFeatured`

#### 3. Pedidos (Multi-Vendor)

**Order** (pago del cliente)
- `id`, `customerId` (FK a User)
- `totalAmount`, `stripePaymentIntentId`
- `status` (PENDING, PAID, CANCELLED, REFUNDED)
- `shippingAddressSnapshot` (JSON: nombre, calle, ciudad, CP, teléfono)
- `createdAt`, `updatedAt`

**SubOrder** (vista del artesano)
- `id`, `orderId` (FK), `storeId` (FK)
- `subtotalAmount`, `commissionAmount`, `payoutAmount`
- `status` (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `sendcloudParcelId`, `trackingUrl`, `shippingLabelUrl`
- `shippingCost` (calculado por Sendcloud)

**OrderItem**
- `id`, `subOrderId` (FK), `productId` (FK)
- `quantity`, `unitPriceAtPurchase`, `totalPrice`

#### 4. Motor de Webhooks

**WebhookEndpoint**
- `id`, `storeId` (FK)
- `url`, `secretKey` (para firmar payloads HMAC)
- `events` (array: suborder.paid, suborder.shipped, suborder.delivered)
- `isActive`, `createdAt`

**WebhookEvent** (log de envíos)
- `id`, `endpointId` (FK)
- `eventType`, `payload` (JSON)
- `status` (SUCCESS, FAILED, RETRYING)
- `httpStatusCode`, `responseBody`
- `attemptCount`, `nextRetryAt`
- `createdAt`, `deliveredAt`

## Vistas del Frontend (Nuxt)

### Públicas (Marketplace)

| Ruta | Descripción |
|------|-------------|
| `/` | Home: destacados, historia del marketplace, categorías |
| `/productos` | Grid con filtros (isla, precio, categoría, subcategoría) |
| `/producto/:id` | Detalle del producto, historia del creador, galería, añadir al carrito |
| `/tienda/:slug` | Perfil del artesano: historia, productos, datos de contacto |
| `/checkout` | Carrito + pasarela de pago Stripe (agrupado por tienda) |
| `/confirmacion/:orderId` | Confirmación post-compra con tracking |
| `/blog` | Artículos sobre cultura balear, recetas, artesanos destacados |
| `/blog/:slug` | Artículo individual |

### Privadas (Dashboard Vendedor)

| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Resumen: ventas, pedidos pendientes, ingresos, comisiones |
| `/dashboard/productos` | CRUD de productos (con upload de imágenes) |
| `/dashboard/pedidos` | Lista de SubOrders. Botón "Generar Etiqueta" + imprimir |
| `/dashboard/ingresos` | Historial de pagos recibidos, comisiones pagadas |
| `/dashboard/ajustes/tienda` | Nombre, descripción, historia, logo, banner |
| `/dashboard/ajustes/logistica` | Dirección de origen, horarios de recogida, preferencia pickup/drop-off |
| `/dashboard/ajustes/webhooks` | Añadir URLs, seleccionar eventos, ver logs de envíos |
| `/dashboard/ajustes/pagos` | Conectar cuenta Stripe Connect |

### Admin (Valor Balear)

| Ruta | Descripción |
|------|-------------|
| `/admin/tiendas` | Gestión de tiendas (aprobar, suspender) |
| `/admin/pedidos` | Todos los pedidos globales |
| `/admin/comisiones` | Reporte de ingresos por comisión |
| `/admin/blog` | Gestión de contenido del blog |

## Logística con Sendcloud

### ¿Qué cubre Sendcloud?
- Generación de etiquetas de envío (PDF)
- Tracking de paquetes
- Programación de recogidas
- Múltiples transportistas (Correos, SEUR, GLS, etc.)

### ¿Cómo funciona la recogida?
Sendcloud permite programar una recogida en la dirección del remitente (el taller del artesano). El artesano configura su horario de disponibilidad y Sendcloud coordina con el transportista.

### ¿Y si el artesano prefiere llevarlo?
**Drop-off**: El artesano genera la etiqueta, la pega y lleva el paquete a una oficina de correos o punto de entrega. No requiere recogida programada.

### Alcance
- **Envíos dentro de Baleares**: Automatizado vía Sendcloud
- **Envíos a España peninsular**: También vía Sendcloud (sin necesidad de certificados especiales para productos estándar)
- **Envíos internacionales**: Fuera de scope inicial

### Integración NestJS → Sendcloud
```
POST /api/v2/parcels
{
  "parcel": {
    "name": "Cliente Final",
    "address": "Calle...",
    "city": "...",
    "postal_code": "...",
    "country": "ES",
    "weight": "500"
  },
  "from_address": {
    "name": "Tienda del Artesano",
    "address": "...",
    "city": "...",
    "postal_code": "...",
    "country": "ES"
  }
}
```

Si el artesano eligió recogida:
```
POST /api/v2/pickups
{
  "pickup": {
    "parcel_ids": ["parcel_id"],
    "pickup_from": "10:00",
    "pickup_until": "14:00",
    "pickup_address": { ... }
  }
}
```

## Pagos con Stripe Connect

### ¿Por qué Stripe Connect?
- **Split automático** del pago entre plataforma y vendedor
- El cliente paga **una sola vez** aunque el carrito tenga productos de varias tiendas
- Stripe distribuye los fondos a cada cuenta de vendedor
- El vendedor recibe el dinero directo en su cuenta bancaria
- Valor Balear recibe su comisión automáticamente

### Flujo de pago

```mermaid
sequenceDiagram
    actor C as Cliente
    participant VB as Valor Balear
    participant SC as Stripe Connect
    participant TA as Tienda A (ensaimada)
    participant TB as Tienda B (collar)

    C->>VB: Paga 50€ (20€ + 30€)
    VB->>SC: PaymentIntent 50€
    SC->>SC: Split automático
    SC->>TA: 18€ (20€ - 10%)
    SC->>TB: 27€ (30€ - 10%)
    SC->>VB: 5€ comisión
    SC->>SC: ~1.5€ fees
    VB->>C: Email confirmación + tracking
    TA->>C: Tracking envío ensaimada
    TB->>C: Tracking envío collar
```

```
Cliente paga 50€ (ensaimada 20€ + collar 30€)
  ↓
Stripe Connect recibe 50€
  ↓
Split automático:
  • Tienda A (ensaimada): 18€ (20€ - 10% comisión)
  • Tienda B (collar): 27€ (30€ - 10% comisión)
  • Valor Balear: 5€ (comisión total)
  • Stripe fees: ~1.5€
```

### Onboarding del vendedor
1. Artesano se registra en Valor Balear
2. Redirigido a Stripe Connect onboarding (KYC simplificado)
3. Stripe crea una "Connected Account" para el vendedor
4. El vendedor recibe pagos directo a su cuenta bancaria

## Motor de Webhooks

### ¿Por qué webhooks?
Los vendedores ya tienen sus propios sistemas (ERP, CRM, hojas de cálculo, apps de stock). Los webhooks les permiten integrar Valor Balear sin abandonar sus herramientas.

### Eventos disponibles

| Evento | Descripción | Payload |
|--------|-------------|---------|
| `suborder.paid` | Sub-pedido pagado | Datos del sub-pedido + items + dirección |
| `suborder.processing` | Artesano marcó como "en preparación" | SubOrder ID + timestamp |
| `suborder.shipped` | Etiqueta generada, enviado | Tracking URL + Sendcloud parcel ID |
| `suborder.delivered` | Paquete entregado | Fecha de entrega + confirmación |
| `suborder.cancelled` | Pedido cancelado | Razón de cancelación |
| `product.stock_low` | Stock bajo del mínimo | Product ID + stock actual |

### Seguridad
Cada webhook se firma con HMAC-SHA256 usando una `secretKey` única por tienda:
```
Header: X-ValorBalear-Signature: sha256=<hash>
Body: { "event": "suborder.paid", "data": { ... } }
```
El CRM del vendedor verifica la firma para confirmar que viene de Valor Balear.

### Reintentos
Si el webhook falla (HTTP != 2xx):
1. Reintento 1: inmediato
2. Reintento 2: 5 minutos
3. Reintento 3: 30 minutos
4. Reintento 4: 2 horas
5. Reintento 5: 6 horas
6. Después: marcado como FAILED, notificación al vendedor

## Promoción y Visibilidad

### Estrategia de contenido
- **Blog**: Artículos sobre cultura balear, recetas tradicionales, entrevistas a artesanos, guías de islas
- **Redes sociales**: Instagram y TikTok con storytelling de los productos y sus creadores
- **SEO**: Cada producto y tienda optimizada para búsquedas ("comprar ensaimada Mallorca", "artesanía Menorca online")

### Newsletter
- Suscripciones por email
- Campañas semanales: "Producto de la semana", "Nueva tienda en Valor Balear"

## Roadmap Sugerido

```mermaid
gantt
    title Valor Balear — Roadmap
    dateFormat  YYYY-MM
    axisFormat  %b %Y

    section Fase 1 — MVP
    Monorepo + Auth        :f1a, 2026-07, 1M
    Catálogo + Carrito     :f1b, after f1a, 1M
    Stripe Connect + SubOrders :f1c, after f1b, 1M

    section Fase 2 — Logística
    Sendcloud integración  :f2a, after f1c, 1M

    section Fase 3 — Webhooks
    Motor de webhooks      :f3a, after f2a, 1M

    section Fase 4 — Contenido
    Blog + SEO continuo    :f4a, 2026-07, 6M

    section Fase 5 — Escalar
    PWA + Reseñas + Fidelización :f5a, 2026-12, 3M

    section Fase 6 — Servicios/Cursos/Eventos
    Marketplace expandido   :f6a, 2027-03, 4M
```

### Fase 1 — MVP (2-3 meses)
- [ ] Setup del monorepo desde Foundation
- [ ] Auth + roles (admin, vendor, customer)
- [ ] Catálogo de productos (CRUD vendedor)
- [ ] Carrito + checkout básico
- [ ] Stripe Connect integración
- [ ] SubOrders (split por tienda)
- [ ] Emails transaccionales (pedido confirmado, enviado)

### Fase 2 — Logística (1 mes)
- [ ] Integración Sendcloud
- [ ] Generación de etiquetas
- [ ] Tracking de envíos
- [ ] Recogida programada + Drop-off

### Fase 3 — Webhooks + API (1 mes)
- [ ] Motor de webhooks
- [ ] Dashboard de webhooks para vendedores
- [ ] Logs y reintentos

### Fase 4 — Contenido + SEO (continuo)
- [ ] Blog
- [ ] Perfiles de tiendas enriquecidos
- [ ] Optimización SEO
- [ ] Campañas en redes sociales

### Fase 5 — Escalar (futuro)
- [ ] App móvil (PWA primero)
- [ ] Sistema de reseñas
- [ ] Programa de fidelización
- [ ] Envíos internacionales

### Fase 6 — Servicios, Cursos y Eventos autóctonos (futuro)
- [ ] **Servicios autóctonos**: contratación de servicios locales (arboricultura, artesanía a medida, talleres presenciales)
- [ ] **Cursos y formaciones**: marketplace de cursos impartidos por expertos baleares (gastronomía, artesanía, oficios tradicionales, naturaleza)
- [ ] **Eventos**: experiencias presenciales y actividades culturales (catas, rutas guiadas, jornadas de concienciación medioambiental)
- [ ] Sistema de reservas con calendario y aforo
- [ ] Perfil de "proveedor de servicios" y "formador" (nuevos roles además de artesano)
- [ ] Valoraciones y certificaciones para servicios y formaciones

## Visión: Servicios, Cursos y Eventos autóctonos

> [!info] Expansión natural del marketplace
> Una vez consolidado el marketplace de productos físicos, Valor Balear se expande a **servicios, cursos y eventos** como evolución lógica de su misión: conectar el talento y la cultura balear con clientes de toda España.

### Arquitectura de la plataforma expandida

```mermaid
flowchart TD
    VB[<b>VALOR BALEAR</b><br/>Marketplace de cultura balear]
    
    VB --> P[🏷️ <b>Productos</b><br/>Gastronomía + Artesanía]
    VB --> S[🔧 <b>Servicios</b><br/>Arboricultura, reformas, consultoría]
    VB --> C[📚 <b>Cursos</b><br/>Formaciones y talleres]
    VB --> E[🎪 <b>Eventos</b><br/>Catas, rutas, experiencias]

    P --> P1[Artesano<br/>rol: VENDOR]
    S --> S1[Proveedor<br/>rol: PROVIDER]
    C --> C1[Formador<br/>rol: INSTRUCTOR]
    E --> E1[Organizador<br/>rol: ORGANIZER]

    P1 --> DASH1[Dashboard<br/>Productos + Pedidos + Envíos]
    S1 --> DASH2[Dashboard<br/>Servicios + Reservas + Calendario]
    C1 --> DASH3[Dashboard<br/>Cursos + Inscripciones + Aforo]
    E1 --> DASH4[Dashboard<br/>Eventos + Tickets + Check-in]
```

### ¿Por qué?

Los productos físicos son la puerta de entrada, pero el valor cultural de Baleares no se limita a objetos. Hay un ecosistema de servicios y conocimiento local que también está **desconectado digitalmente**:

- **Servicios autóctonos**: arboricultura profesional, artesanía aplicada (reformas, restauración), consultoría agrícola tradicional
- **Cursos y formaciones**: cocina mallorquina, cerámica tradicional, trepa de árboles, gestión forestal mediterránea
- **Eventos**: catas de vino y aceite, rutas botánicas guiadas, jornadas de concienciación medioambiental, talleres de oficios tradicionales

### Caso concreto: Nemus Arboricultura

[[08 - Clientes/Nemus Arboricultura|Nemus Arboricultura y Formación]] es el ejemplo perfecto de lo que Valor Balear podría albergar en su fase 6:

| Dimensión | Nemus en Valor Balear |
|-----------|----------------------|
| **Servicio** | Contratación de servicios de arboricultura (poda, gestión forestal, evaluación de riesgos) |
| **Curso** | Formaciones profesionales: Técnico, Trepador, Palmerista, Forestal |
| **Evento** | Experiencias de concienciación medioambiental: "El conocimiento nos acerca al bosque" |

Nemus ya opera en Inca (misma ciudad que [[07 - Informacion Publica/Perfil Publico - Adrian Colom Palacios|Adrián Colom]]) y es miembro de la Asociación Española de Arboricultura. Su modelo de negocio — servicios + formación + experiencias — encaja perfectamente en la visión expandida de Valor Balear.

### Nuevos roles en la plataforma

La Fase 6 introduce dos nuevos tipos de vendor además del artesano:

1. **Proveedor de servicios** — ofrece servicios contratables (arboricultura, reformas, consultoría)
2. **Formador** — imparte cursos y talleres (presenciales u online)
3. **Organizador de eventos** — crea experiencias y actividades culturales

Cada uno con su propio dashboard, sistema de reservas, y gestión de disponibilidad.

## Relaciones

- Parte del ecosistema SOM-U
- Construido sobre [[Foundation]] como base técnica (monorepo NestJS + Nuxt)
- Complementa [[Atenfy]] para atención al cliente automatizada
- Podría usar [[CanvasAPI]] para generar contenido visual de marketing
- [[GenLegalTxts]] puede proveer textos legales (términos y condiciones, privacidad)
- [[08 - Clientes/Nemus Arboricultura|Nemus Arboricultura]] — caso concreto de proveedor de servicios, cursos y eventos autóctonos para la Fase 6
