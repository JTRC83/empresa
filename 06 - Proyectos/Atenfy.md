---
title: "Atenfy"
tags:
  - proyecto
  - producto
  - bots
  - ia
  - llamadas
  - multicanal
  - reservas
  - atención-cliente
  - chatbot
  - whatsapp
  - instagram
  - agenda
  - ventas
  - SOM-OS.dev
  - ecosistema
category: proyecto
url: https://agent.ikiraisolutions.com/
code_path: "C:\\proyectos\\atenfy"
status: activo
---

# Atenfy

> [!info] Visión general
> Atenfy es una plataforma de **atención al cliente 24/7 con IA** que gestiona conversaciones inteligentes multicanal. Asistentes virtuales que aprenden del negocio, se adaptan y ofrecen soporte excepcional en cualquier canal: web, WhatsApp, Instagram y llamadas telefónicas.

## Qué es

- **Manager de bots y llamadas con IA multicanal**
- Dedicado principalmente a **reservas** (restaurantes, hoteles, servicios, clínicas)
- La IA maneja conversaciones iniciales y resolución automática
- **Handoff inteligente a humanos** — si la IA no puede resolver, redirige con contexto completo
- Asistentes que aprenden del negocio, productos y servicios

## Propuesta de valor

> "Atención al cliente 24/7 con IA que responde por ti"

Atenfy lleva la atención al cliente a otro nivel. Asistentes virtuales que:
- Aprenden de tu negocio, productos y servicios
- Se adaptan y ofrecen soporte excepcional
- Trabajan en cualquier canal (web, WhatsApp, Instagram, teléfono)
- Automatizan reservas, ventas y atención al cliente

## Canales soportados

| Canal | Descripción |
|-------|-------------|
| **Web** | Chatbot embebido en sitio web con widget flotante |
| **WhatsApp** | Bot de WhatsApp Business para mensajes y reservas |
| **Instagram** | Automatización de DMs, consultas de productos y citas |
| **Llamadas** | Sistema de llamadas con IA (PRO) que agenda citas y confirma reservas |

## Servicios

### 1. Agenda y Ventas
- Automatiza la programación de citas
- Bots que califican leads y cierran ventas
- Procesos de venta automatizados

### 2. Atención al Cliente
- Soporte 24/7 en todos los canales
- Resolución automática de consultas frecuentes
- Escalado inteligente a humanos cuando es necesario

### 3. Llamadas Automatizadas (PRO)
- Sistema de llamadas con IA
- Agenda citas por teléfono
- Confirma reservas
- Atención telefónica automatizada

### 4. Chatbot Web
- Asistentes virtuales para sitio web
- Atienden visitantes
- Generan ventas
- Soporte al cliente 24/7

### 5. Instagram
- Automatiza respuestas en DMs
- Gestiona consultas de productos
- Agenda citas directamente desde Instagram

## Beneficios

| # | Beneficio | Descripción |
|---|-----------|-------------|
| 01 | **Ahorra tiempo y dinero** | Más clientes atendidos, menos esfuerzo para tu equipo, menos esperas |
| 02 | **Atención 24/7 en todos tus canales** | WhatsApp, Instagram, web y llamadas — sin esfuerzo |
| 03 | **Escalabilidad** | Con asistentes inteligentes atiendes más, mejor y sin complicaciones |
| 04 | **Todo desde un solo portal** | Gestión centralizada de todos los canales |
| 05 | **Reservas automatizadas** | Programación de citas sin intervención humana |
| 06 | **Personalización sin límites** | IA adaptable a cualquier negocio y proceso |

## Cómo funciona (3 pasos)

### Paso 1: Configura y Entrena tu Agente
- Cuéntale a tu IA sobre tu negocio, productos y servicios
- Define su tono y personalidad para que hable como tú
- Configura FAQs y respuestas

### Paso 2: Conecta los Canales
- Integra tu agente en web, WhatsApp, Instagram
- Sistema de llamadas (opcional PRO)

### Paso 3: Gestiona desde el Portal
- Dashboard unificado
- Handoff a humanos cuando la IA no puede resolver
- Analytics y métricas de conversaciones

## Planes

### Plan Enterprise (Personalizado)
- Soluciones para grandes empresas y administraciones públicas
- Integración múltiple (canales y sistemas)
- Soporte exclusivo (asistencia prioritaria 24/7)
- IA personalizada (adaptada a tus procesos)
- Configuración avanzada para grandes organizaciones
- Precio personalizado

## Casos de éxito (Testimonios)

> "Nuestro bot de WhatsApp ahora maneja el 100% de las consultas de clientes automáticamente. Pasamos de 50 tickets diarios a solo 10. El ROI ha sido increíble."
> — **María González**, Directora de Marketing

> "Construí un bot asistente de compras en 2 horas que aumentó nuestra tasa de conversión en 35%. Los clientes aman recibir recomendaciones instantáneas vía WhatsApp."
> — **Carlos Rodríguez**, Propietario E-commerce

> "Nuestro bot de generación de leads califica prospectos 24/7 y agenda llamadas automáticamente. Hemos duplicado nuestros leads calificados sin contratar más vendedores."
> — **Ana Martínez**, Fundadora Startup

## Handoff Humano

Cuando la IA no puede resolver una consulta:
1. Detecta la limitación automáticamente
2. Transfiere la conversación a un agente humano
3. **Mantiene el contexto completo** de la conversación
4. El humano recibe el historial completo para continuar sin fricción

## URLs

- **Web:** https://agent.ikiraisolutions.com/
- **Login:** Accesible desde la web principal

## Stack Técnico

> [!note] Construido sobre [[Foundation]]
> Atenfy comparte la misma base técnica que Foundation. Es un fork/extension del monorepo Foundation con features específicos de agentes IA.

### Base (heredado de Foundation)
- **Monorepo:** Turborepo + pnpm
- **Backend:** NestJS + TypeORM + PostgreSQL + Redis
- **Frontend:** Nuxt 3 + Vue 3 + Tailwind CSS + DaisyUI
- **Auth:** JWT + API Keys + Sessions + RBAC
- **Email:** Nodemailer + BullMQ + Maizzle
- **File Storage:** Local / S3
- **MCP Vector Search:** Búsqueda semántica de código

### Features específicas de Atenfy (según TODO)
- **Agentes IA con conocimiento del negocio**
- **Chatbots multicanal** (web, WhatsApp, Instagram)
- **Llamadas automatizadas con IA**
- **Flujo de generación de contenido con IA:**
  - Videos (ads de producto, persona IA, infografías)
  - Blogs
- **Flujo de publicación en redes sociales**
- **Gestor de tareas**
- **Sistema de incidencias**
- **Newsletter** (suscripciones, campañas)
- **Stripe:** Planes mensuales/anuales, suscripciones, customer portal

### Estado de desarrollo (TODO)
| Feature | Estado |
|---------|--------|
| Módulo de archivos (auto-cleanup) | ✅ Done |
| Control de errores (backend + frontend) | ✅ Done |
| Auth basado en roles | ✅ Done |
| Organización de carpetas | ✅ Done |
| Documentación | ✅ Done |
| i18n / Zod locale | 🔄 Pendiente |
| Generadores de módulos | 🔄 Pendiente |
| CMS | 🔄 Pendiente |
| Stripe pagos | 🔄 Pendiente |
| Newsletter | 🔄 Pendiente |
| Videos IA | 🔄 Pendiente |
| Agentes IA | 🔄 Pendiente |
| Chatbots y llamadas IA | 🔄 Pendiente |

## Relaciones

- Parte del ecosistema SOM-OS
- Construido sobre [[Foundation]] como base técnica
- Complementa [[CanvasAPI]] para generación de contenido visual
- [[GenLegalTxts]] podría integrarse para textos legales de los bots
- Construido sobre la filosofía de "conectar" del [[Concepto Central - De aislado a conectado]]
- Potencialmente construido sobre [[Foundation]] como base técnica
- Complementa [[CanvasAPI]] para generación de contenido visual
- GenLegalTxts podría integrarse para textos legales de los bots
