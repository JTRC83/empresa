---
title: "SOM-OS CRM - Motor de Inteligencia Comercial"
date: 2026-05-12
tags:
  - proyecto
  - crm
  - outreach
  - ia
  - foundation
  - SOM-OS.dev
  - ecosistema
  - linkedin
  - lead-generation
category: proyecto
status: diseño
description: "Sistema CRM + motor de outreach canal-agnóstico construido sobre Foundation. Centraliza inteligencia de contactos, enriquece empresas automáticamente con IA, genera propuestas visuales personalizadas, y gestiona relaciones multicanal desde un solo lugar."
---

# SOM-OS CRM — Motor de Inteligencia Comercial

> [!info] Visión general
> Un CRM **no inflado** que centraliza la inteligencia sobre cada contacto y empresa. Construido como extensión de [[Foundation]], hereda auth, email, storage, CMS y componentes UI. El sistema enriquece leads automáticamente con IA, clasifica su madurez digital, sugiere servicios del ecosistema SOM-OS, y permite outreach multicanal (LinkedIn, email, WhatsApp) desde un solo lugar con tracking unificado.

---

## 1. ¿Para qué sirve?

### El problema que resuelve

SOM-OS.dev crece por **boca a boca, eventos y conexiones personales**. Pero cada contacto vive en un lugar distinto: WhatsApp, LinkedIn, memoria, un papel, un email perdido. No hay **un solo lugar** donde ver:

- A quién conocés
- Cómo lo conociste
- Qué le ofreciste
- En qué fase está
- Qué productos del ecosistema le aplican

El CRM resuelve esto. Pero además **no te limita a registrar** — te da inteligencia:

- **Enriquecimiento automático**: metés un nombre de empresa, el sistema investiga todo lo demás
- **Clasificación automática**: el sistema detecta en qué fase digital está y sugiere qué servicios ofrecer
- **Outreach preparado**: el sistema te redacta el mensaje, genera el hero visual, y te da la URL de tracking

### Lo que NO es

- ❌ Un CRM inflado con pipelines de ventas, forecasting, deals complejos
- ❌ Un spammer automático de cold emails
- ❌ Un sustituto de las relaciones personales

### Lo que SÍ es

- ✅ Un **segundo cerebro** para tus relaciones comerciales
- ✅ Un **acelerador** que hace el trabajo pesado de investigación por vos
- ✅ Un **puente** entre el contacto y los productos del ecosistema SOM-OS

---

## 2. Filosofía: la web es el gancho, el sistema es el valor

Esta es la decisión más importante del diseño.

El [[Concepto Central Actualizado - De componentes aislados a sistemas operativos inteligentes]] dice: SOM-OS.dev transforma componentes aislados en sistemas operativos inteligentes. Pero una pequeña empresa no entiende "sistema operativo empresarial." Entiende **"necesito una web."**

La estrategia es híbrida:

```
Lo que el lead VE:        Un hero de web personalizado, impacto visual inmediato
Lo que el lead COMPRA:     Un sistema que conecta sus procesos, personas e IA

El hero es la puerta. El sistema operativo es la casa.
```

Esto implica que:
- El **hero generado por IA** es una herramienta de conversación, no el producto final
- El **CRM clasifica automáticamente** la fase digital de cada empresa y sugiere el servicio real que necesita
- El **cross-sell del ecosistema** ([[Atenfy]], [[CanvasAPI]], [[GenLegalTxts]]) es orgánico, no forzado

La web que construye SOM-OS.dev no es un folleto digital. Es el **núcleo visible de un sistema operativo**. Lo demás — automatizaciones, IA, integraciones — es lo que transforma el negocio.

---

## 3. Modelo de datos

Tres entidades. Sin relaciones complejas, sin entidades intermedias innecesarias.

### 3.1 Company — la ficha de la empresa

```typescript
CompanyEntity {
  id: UUID
  name: string
  domain: string?
  phone: string?
  address: string?
  googlePlaceId: string?          // de Apify Maps
  googleMapsUrl: string?

  // Clasificación automática por IA
  sector: string?                 // detectado por IA
  description: string?            // generado por IA (3 frases)
  digitalPhase: enum              // analog | digital_basic | automated | ai_integrated | expanding
  webStatus: enum                 // no_website | social_only | outdated | functional
  suggestedServices: jsonb?       // ["web_creation", "atenfy", "canvasapi"] — sugerido por IA

  // Señales de fricción (calculadas automáticamente)
  frictionScore: jsonb?           // { total: 0-50, web: 0-10, booking: 0-10, payment: 0-10, platforms: 0-10 }

  // Enriquecimiento
  socialLinks: jsonb?             // { linkedin, instagram, facebook, twitter }
  enrichmentData: jsonb?          // datos crudos de Tavily + IA
  enrichedAt: timestamp?

  createdAt, updatedAt, deletedAt
}
```

### 3.2 Contact — la persona (dos ejes, no uno)

```typescript
ContactEntity {
  id: UUID
  company: ManyToOne<Company>?
  firstName: string?
  lastName: string?
  email: string?
  phone: string?
  role: string?
  linkedinUrl: string?

  // ── LOS DOS EJES ──
  source: enum          // referral | event | inbound | outbound | manual
  profile: enum         // lead | client | connector | contact | partner | past_client

  // Solo si source = referral
  referredBy: ManyToOne<Contact>?

  // Solo si profile = lead
  status: enum?         // new | researched | contacted | replied | meeting | won | lost

  // Intereses
  interestedProducts: jsonb?     // ["web_creation", "atenfy"] — marcado o sugerido

  notes: text?
  tags: jsonb?

  // Tracking
  lastContactedAt: timestamp?
  nextFollowUpAt: timestamp?

  createdAt, updatedAt, deletedAt
}
```

**Por qué dos ejes (source + profile) en vez de un solo `type`:**

| Enfoque | Problema |
|---------|----------|
| `type: lead_referral` | Explosión combinatoria: 5 sources × 6 profiles = 30 tipos. Imposible de mantener. |
| `source` + `profile` | 5 + 6 = 11 valores. Filtrás por lo que necesitás en cada momento. `source=referral AND profile=lead` → leads de boca a boca. |

**`Source`** es estático (cómo lo conociste no cambia). **`Profile`** evoluciona (lead → client → past_client). El sistema no necesita lógica compleja para entender los cambios de estado.

### 3.3 Engagement — el outreach, canal-agnóstico

```typescript
EngagementEntity {
  id: UUID
  contact: ManyToOne<Contact>
  company: ManyToOne<Company>    // redundante pero práctico para queries

  channel: enum          // linkedin_connect | linkedin_message | email
                          // | whatsapp | instagram_dm | call | in_person
  direction: enum        // outbound (vos → ellos) | inbound (ellos → vos)

  status: enum           // pending | sent | delivered | opened | clicked
                          // | replied | bounced | failed

  shortcode: string UNIQUE     // URL única: /e/:shortcode → tracking + landing

  // Contenido generado por IA
  aiGeneratedContent: jsonb?   // { heroImageUrl, palette, typography, suggestedMessage }

  // Tracking
  sentAt: timestamp?
  openedAt: timestamp?
  clickedAt: timestamp?
  repliedAt: timestamp?

  // Metadata específica del canal (flexible)
  channelMetadata: jsonb?      // { linkedin_url, email_subject, whatsapp_template, ... }

  createdAt, updatedAt
}
```

**Por qué canal-agnóstico y no email-only:**

El CRM no debería acoplarse a un canal. Hoy es LinkedIn. Mañana puede ser WhatsApp. La entidad registra el hecho de "intenté contactar" sin importar el medio. El `channelMetadata` JSONB da flexibilidad sin multiplicar entidades.

---

## 4. Pipeline de descubrimiento de leads

### 4.1 Fuentes

| Fuente | Herramienta | Qué aporta | Volumen estimado |
|--------|-------------|-----------|-----------------|
| Google Maps | Apify Actor | Empresas locales con datos estructurados | 300-500/ejecución |
| Instagram | Apify Actor | Señales de fricción real ("DM para reservar") | Enriquecimiento de Maps |
| Búsqueda semántica | Tavily | Contexto, noticias, empresas sin presencia en Maps | 100-200/mes |
| Manual/Eventos | Entrada directa | Contactos de networking, boca a boca | Variable |

### 4.2 Friction Score (detección de caos operativo)

En vez de buscar solo "sin web", el sistema calcula 5 señales:

| Señal | Rango | Cómo se detecta |
|-------|-------|----------------|
| **Web** | 0-10 | 0=web funcional, 5=solo Facebook, 10=sin nada |
| **Booking** | 0-10 | 0=online, 5=email, 10=WhatsApp/teléfono |
| **Payment** | 0-10 | 0=online, 5=transferencia, 10=solo efectivo |
| **Contact** | 0-10 | 0=form+chat, 5=email, 10=solo teléfono |
| **Platforms** | 0-10 | 0=integrado, 5=2-3 herramientas, 10=desconexión total |

**Score total ≥ 30 → lead prioritario.** La detección se hace combinando:
- Google Maps (`website` field + categorías)
- Instagram bio scraping (`"DM"`, `"whatsapp"`, `"llamar"`)
- Headless check de la web (si existe)

### 4.3 Clasificación automática de fase digital

Una vez detectado el lead, DeepSeek V4 Flash clasifica:

```
Fase digital          → Servicio sugerido
─────────────────────────────────────────
analog                → web_creation
digital_basic         → web_creation + genlegaltxts
automated             → canvasapi + atefy
ai_integrated         → atefy + sistemas a medida
expanding             → consultoría SOM-OS.dev (evangelizar ecosistema)
```

**Por qué DeepSeek V4 Flash**: A $0.20/1M tokens input, clasificar 500 leads cuesta ~$0.08. Es irrelevante. La calidad de clasificación es buena (no excelente), por eso cada clasificación incluye un `confidence` score. Si confianza < 0.7, el lead va a revisión manual.

---

## 5. Motor de IA

### 5.1 Servicios de IA

| Servicio | Modelo | Función | Coste por lead |
|----------|--------|---------|---------------|
| Enrichment | DeepSeek V4 Flash | Investiga empresa, genera descripción, detecta sector | ~$0.0006 |
| Phase Classifier | DeepSeek V4 Flash | Clasifica fase digital, sugiere servicios | ~$0.0001 |
| Design Research | DeepSeek V4 Flash | Analiza referencias de diseño del sector | ~$0.0015 |
| Style Extraction | DeepSeek V4 Flash | Propone paleta + tipografía para el hero | ~$0.0006 |
| Content Agent | DeepSeek V4 Flash | Genera headline + subheadline + CTA | ~$0.0003 |
| Hero Render | Puppeteer | Renderiza HTML → PNG (1200×630) | ~$0.005 |
| Image Fixer | Wavespeed | Corrige errores visuales (opcional) | ~$0.01-0.03 |
| **TOTAL** | | | **~$0.02-0.04** |

### 5.2 Agente de Hero Generation

El agente de generación de hero NO crea logos (el logo es sagrado, no se toca). En su lugar:

1. **Investiga** referencias de diseño en el sector del lead (Tavily + DeepSeek)
2. **Extrae** patrones: paletas de color, tipografías dominantes, estilos visuales
3. **Propone** paleta de 5 colores + 2 tipografías Google Fonts + estilo visual
4. **Genera** headline, subheadline y CTA contextualizados a la empresa
5. **Renderiza** un template HTML pre-diseñado con las variables dinámicas → PNG
6. **Opcionalmente** corrige errores visuales con Wavespeed

El resultado es una **propuesta visual**, no una web terminada. Suficiente para iniciar una conversación. El valor real está en lo que viene después.

---

## 6. Estrategia de canales

### 6.1 Canal primario: LinkedIn

LinkedIn es el canal correcto para B2B pequeña empresa por tres razones:

1. **Contexto profesional**: El dueño está en LinkedIn como profesional, no como consumidor
2. **Permiso implícito**: Una conexión aceptada es permiso para hablar
3. **Tasa de respuesta**: 40-60% en conexiones aceptadas vs 1-3% en cold email

El flujo en LinkedIn es **semi-automático** (LinkedIn no tiene API pública para mensajes):

```
FASE 1 — Engage (manual, 1-2 semanas)
  → Buscar al dueño/gerente
  → Interactuar con su contenido (comentarios reales)

FASE 2 — Connect (manual, con preparación del CRM)
  → El CRM prepara la nota de conexión personalizada
  → Copiar, pegar, enviar

FASE 3 — Message (tras aceptar, 2-3 días después)
  → El CRM genera el mensaje con la URL única + hero
  → Copiar, pegar, enviar
  → El CRM trackea clicks en la URL única
```

**El CRM no envía por LinkedIn. Prepara. El envío es manual.** Pero el ahorro de tiempo es real: investigar la empresa, redactar el mensaje, generar el hero, crear la URL de tracking — el sistema lo hace en segundos.

### 6.2 Canal secundario: Email (AWS SES)

Para leads donde no hay presencia en LinkedIn o el email es más apropiado:

- AWS SES con warmup progresivo (5 emails/día → 320 emails/día en 3 semanas)
- Subdominio separado (`out.SOM-OS.dev.com`) para no quemar la reputación del dominio principal
- Templates Maizzle que Foundation ya tiene
- Bounce/complaint handling automático vía SNS webhooks

### 6.3 Canal futuro: WhatsApp Business API

Mayor tasa de respuesta en España (90%+ open rate). Pero requiere:
- Verificación de negocio de Meta (semanas)
- Templates pre-aprobados
- Coste por conversación

El `EngagementEntity` ya soporta `channel: whatsapp`. Solo es añadir el handler cuando llegue el momento.

### 6.4 Conectores: newsletter pasiva

Los contactos con `profile: connector` reciben una newsletter mensual **sin presión comercial**:

- Un proyecto terminado (con captura, sin nombres)
- Una herramienta o módulo nuevo en Foundation
- Un aprendizaje del mes
- "Si conocés a alguien que necesite esto, reenviale este email"

Foundation ya tiene Maizzle + EmailQueueModule + ScheduleModule. 30 minutos de implementación.

---

## 7. URL única + tracking

Cada `EngagementEntity` genera un `shortcode` único de 7 caracteres al crearse.

```
URL: https://crm.SOM-OS.dev.com/e/aB3xK9m

Página pública (sin auth) que muestra:
┌──────────────────────────────────────────────┐
│  [Hero generado por IA específico para ellos] │
│                                              │
│  "Creamos esto pensando en [empresa]"        │
│                                              │
│  Sector · Ubicación · Fase digital           │
│                                              │
│  [Agendar reunión]  ← Cal.com embed          │
│  [Ver más]           ← Información adicional │
│                                              │
│  También podemos ayudarte con:               │
│  · Atención al cliente 24/7 → Atenfy          │
│  · Textos legales → GenLegalTxts              │
│  · Contenido visual automatizado → CanvasAPI  │
└──────────────────────────────────────────────┘
```

**Eventos trackeados automáticamente:**

| Evento | Significado |
|--------|-------------|
| `page_view` | Abrió el link |
| `hero_view` | Hizo scroll hasta el hero |
| `cta_schedule_click` | Quiere reunión → LEAD CALIENTE |
| `cta_more_click` | Curiosidad → LEAD TIBIO |

Ventaja sobre el pixel de tracking tradicional: no es invisible. Es una página que **aporta valor**. El lead ve algo hecho para él, no un email genérico.

---

## 8. Flujo post-reunión

Para high-ticket B2B, no todo debe automatizarse. La propuesta se hace manual. Pero el sistema asiste:

```
1. Lead agenda en Cal.com → webhook actualiza Contact.status = meeting
2. Reunión en Google Meet (integrado con Cal.com)
3. Grabación → STT con Whisper API (~$0.006/min)
4. DeepSeek resume la reunión:
   "María necesita X. Preocupaciones: Y. Budget: Z€. Próximo paso: W."
5. Creás propuesta manual (con CanvasAPI si aplica)
6. Enviás por email (Maizzle template de propuesta)
7. Contact.status → proposal_sent → won / lost
```

Lo que el sistema automatiza: transcripción + resumen. Lo que hacés vos: la propuesta. El sistema te libera de **tomar notas en la reunión**, no de pensar la solución.

---

## 9. Stack técnico

### 9.1 Lo que Foundation YA resuelve

| Necesidad | Componente Foundation | % ya hecho |
|-----------|----------------------|-----------|
| Auth + roles | `modules/iam/` (JWT, RBAC, API keys) | 100% |
| Email templates | Maizzle + BullMQ + Redis | 100% |
| Email queue | `EmailQueueModule` (BullMQ) | 100% |
| Almacenamiento | `modules/storage/` (S3/local + FileEntity) | 100% |
| Listado de datos | DataTable (TanStack Table) | 100% |
| Formularios | 11 Form components (vee-validate + Zod) | 100% |
| Editor de texto | RichEditor (TipTap v3) | 100% |
| Landing pública | 15 componentes (Hero, CTA, Features) | 80% |
| CMS + SEO | `modules/cms/` (páginas, meta tags) | 90% |
| Error tracking | `modules/error-tracker/` (Telegram notifier) | 100% |
| i18n | `modules/translations/` | 100% |
| Scaffolding | Hygen generators (`pnpm generate:extension`) | 100% |

### 9.2 Lo que se construye nuevo

| Componente | Ubicación | Esfuerzo |
|-----------|-----------|----------|
| CompanyEntity + ContactEntity | `extensions/crm/infrastructure/entities/` | 1h |
| EngagementEntity | `extensions/crm/infrastructure/entities/` | 30min |
| CRUD backend (controller, service, DTO) | `extensions/crm/` | 3h |
| DataTable frontend | `modules/crm/` (Nuxt layer) | 2h |
| Ficha de contacto/empresa | `modules/crm/` | 2h |
| LeadDiscoveryService | `extensions/crm/services/` | 3h |
| CompanyEnrichmentService | `extensions/crm/services/` | 2h |
| PhaseClassifierService | `extensions/crm/services/` | 1h |
| HeroGeneratorService | `extensions/crm/services/` | 5h |
| EngagementService | `extensions/crm/services/` | 2h |
| TrackingController (público) | `extensions/crm/controllers/` | 2h |
| Página pública `/e/:shortcode` | `modules/crm/pages/` | 2h |
| SES webhook handler | `extensions/crm/controllers/` | 1h |
| Maizzle templates (outreach + newsletter) | `mail-templates/` | 1h |
| **TOTAL** | | **~27.5h** |

### 9.3 Servicios externos

| Servicio | Propósito | Coste mensual |
|----------|-----------|--------------|
| Apify | Google Maps + Instagram scraping | $5-10 |
| Tavily | Búsqueda semántica (1000/mes free) | $0 |
| DeepSeek V4 Flash | IA: enrichment, clasificación, contenido | $2-5 |
| Wavespeed | Edición de imagen (opcional) | $1-3 |
| AWS SES | Email outreach (cuando haya volumen) | $0.10/1000 |
| Whisper API | STT reuniones (~60 min/mes) | $0.36 |
| Cal.com | Scheduling (free tier) | $0 |
| **TOTAL** | | **~$10-20/mes** |

---

## 10. Registro de decisiones

### ¿Por qué dos ejes y no un solo tipo de contacto?

Un solo campo `type` con valores como `lead_referral`, `client_inbound`, `connector_event` crea una explosión combinatoria (5×6=30 tipos). Dos campos independientes (`source` + `profile`) permiten filtrar por cualquiera de los dos ejes sin multiplicar valores. Más limpio, más mantenible, más fácil de extender.

### ¿Por qué EngagementEntity canal-agnóstico y no OutreachEntity email-only?

El CRM no debería acoplarse a un canal de comunicación. Hoy LinkedIn funciona mejor que el email para B2B pequeña empresa en España. Mañana puede ser WhatsApp. El sistema registra el hecho del contacto, no el medio. `channelMetadata` JSONB da flexibilidad sin entidades extra.

### ¿Por qué LinkedIn como canal primario y no cold email?

Tres datos: (1) El dueño de una pyme está en LinkedIn como profesional, no en su bandeja de spam. (2) Una conexión aceptada es permiso implícito — no es un desconocido. (3) La tasa de respuesta en conexiones aceptadas es 40-60% vs 1-3% en cold email. Son órdenes de magnitud de diferencia.

### ¿Por qué DeepSeek V4 Flash y no OpenAI?

Coste: $0.20/1M tokens input vs $0.15/1M de GPT-4o-mini. Pero la diferencia real es irrelevante a esta escala. La razón es **independencia de proveedor**: DeepSeek no es OpenAI. Si mañana cambian los precios o las políticas, cambiás el modelo, no la arquitectura.

### ¿Por qué no generar logo con IA?

El logo es identidad, no decoración. Un logo generado por IA que no captura la esencia de la empresa es peor que no tener logo. La decisión es consciente: el hero lleva paleta, tipografía, headline y CTA. Sin logo generado.

### ¿Por qué no RelationshipEntity separada?

`Contact.referredBy` como FK a sí mismo cubre el 90% de los casos con 0% de complejidad extra. Los conectores se miden por el número de contactos que los referencian (count en backend, no hace falta entidad). Para el MVP, una entidad de relaciones es sobre-ingeniería.

### ¿Por qué no automatizar las propuestas?

High-ticket B2B requiere propuestas personalizadas. Una propuesta generada por IA que no entiende el contexto completo del negocio es contraproducente. Lo que sí se automatiza: la transcripción de la reunión y el resumen de necesidades. La propuesta la hace una persona.

---

## 11. Relaciones con el ecosistema SOM-OS

| Proyecto | Cómo se integra |
|----------|----------------|
| [[Foundation]] | Base técnica. Extensión `crm/` + Nuxt layer. | 
| [[Atenfy]] | Cross-sell en outreach: "¿Atender clientes 24/7?" → Atenfy |
| [[CanvasAPI]] | Templates visuales para propuestas y contenido de outreach |
| [[GenLegalTxts]] | Cross-sell en outreach: "¿Textos legales para tu web?" → GenLegalTxts |
| [[Valor Balear]] | Los leads de Valor Balear (artesanos, productores) entran al mismo CRM |
| [[SOM Tap - Tarjeta de Visita Digital Inteligente\|SOM Tap]] | **Fuente principal de leads.** Webhook push automático. Cada contacto recolectado → lead en CRM. OCR con Tesseract.js, IA con DeepSeek V4 Flash. |

---

## 12. Plan de implementación

### Fase 1: Fundación (días 1-3)
- [ ] Scaffold `extensions/crm/`
- [ ] CompanyEntity + ContactEntity + EngagementEntity + migración
- [ ] CRUD backend (controller, service, DTO)
- [ ] DataTable frontend de companies y contacts
- [ ] Ficha de contacto/empresa

### Fase 2: Inteligencia (días 4-6)
- [ ] LeadDiscoveryService (Apify Maps + Instagram)
- [ ] FrictionScoreService (cálculo automático)
- [ ] CompanyEnrichmentService (Tavily + DeepSeek)
- [ ] PhaseClassifierService (DeepSeek)
- [ ] Poblar con contactos reales existentes (eventos, boca a boca)

### Fase 3: Outreach (días 7-9)
- [ ] HeroGeneratorService (agentes IA)
- [ ] EngagementService (canal-agnóstico)
- [ ] URL única + página pública `/e/:shortcode`
- [ ] Tracking de eventos
- [ ] Maizzle templates (outreach + newsletter)

### Fase 4: Canales (días 10-12)
- [ ] LinkedIn handler (preparación de mensajes)
- [ ] AWS SES integración + warmup service
- [ ] SNS webhook para bounce/complaint
- [ ] Newsletter mensual para conectores

### Fase 5: Cierre del ciclo (días 13-15)
- [ ] Integración Cal.com webhook
- [ ] STT reuniones (Whisper API)
- [ ] Dashboard simple de métricas
- [ ] Prueba end-to-end con 5 leads reales

---

## 13. Lo que NO se construye (y por qué)

| Ítem | Motivo |
|------|--------|
| Pipeline de ventas complejo | Overkill para venta consultiva de alto ticket |
| Forecasting | No aplica a este volumen |
| RelationshipEntity | `referredBy` como FK cubre el 90% |
| LeadSourceEntity | `source` como enum cubre el 100% |
| TrackingEventEntity separada | EngagementEntity ya tiene los timestamps necesarios |
| Automatización completa de LinkedIn | No tiene API pública; el copy-paste manual es aceptable |
| WhatsApp Business API | Fase 2. Requiere verificación de Meta |
| Per-client extension folders | Rechazado. Arquitectura más simple. |
| Generación de logo con IA | El logo es sagrado. No se toca. |

---

*Este documento es el plan de diseño del SOM-OS CRM. Las decisiones aquí tomadas reflejan el equilibrio entre inteligencia automatizada y simplicidad operativa. El sistema no reemplaza las relaciones humanas — las amplifica.*

EXTRA:
Tarjeta de visita de la app con QR, este QR le enseñaría un formulario a la persona, pondría su email, número de teléfono y nombre y se le enviaría al correo todos los datos de la empresa, que hacemos, etc. (se registraría como un boca a boca)