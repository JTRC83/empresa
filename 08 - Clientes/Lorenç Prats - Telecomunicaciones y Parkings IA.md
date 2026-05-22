---
title: "Lorenç Prats — Telecomunicaciones y Parkings con IA"
date: 2026-05-22
tags:
  - cliente-potencial
  - telecomunicaciones
  - parkings
  - ia-conversacional
  - voip
  - integracion-hardware
description: "Ficha de cliente de Lorenç Prats, profesional del sector telecomunicaciones con acceso a managers de parkings. Propone un sistema híbrido de resolución de incidencias con IA: interfaz táctil para usuarios de pie y llamada telefónica IA vía VoIP para usuarios en coche. Integración con sistemas de gestión de parking (barreras, matrículas, pagos)."
---

# Lorenç Prats — Parkings IA

> [!info] Resumen
> Lorenç Prats es un profesional del sector telecomunicaciones, conocido a través de un grupo de CEOs. Tiene acceso directo a **managers de parkings** como clientes y propone un sistema para automatizar la resolución de incidencias mediante IA. Su visión es híbrida: una tablet/formulario en puntos físicos del parking (máquina de pago, junto a puertas) para usuarios de pie, y una llamada telefónica con IA vía VoIP para usuarios que ya están en el coche (telefonillo). Lorenç se encargaría de la capa de telefonía (VoIP/SIP trunking), mientras SOM-OS.dev construiría la IA conversacional, la app de gestión y el conector con los sistemas internos de los parkings.

## Contexto

Origen: contacto directo en grupo de CEOs. No existía información previa sobre este cliente en el vault. Lorenç detectó una oportunidad en un sector donde ya tiene relaciones comerciales (managers de parkings) y donde su expertise en telecomunicaciones le da una ventaja clara: la capa de telefonía.

A diferencia de otros clientes del vault como [[08 - Clientes/Nemus Arboricultura|Nemus]] (servicios físicos) o [[08 - Clientes/Sando Capital - Javier Sandoval Haro|Sando Capital]] (intermediación financiera), este proyecto tiene un **componente hardware + software + telecomunicaciones**. Es el proyecto más cercano al ADN de SOM-OS.dev como arquitecto de sistemas: integrar dispositivos físicos, voz, IA y software de gestión en un solo sistema operativo.

## Datos del cliente

| Campo | Valor |
|-------|-------|
| Nombre | Lorenç Prats |
| Sector | Telecomunicaciones |
| Rol | Proveedor de infraestructura telefónica / Partner estratégico |
| Relación | Conocido en grupo de CEOs |
| Clientes finales | Managers de parkings (B2B) |
| Propuesta | Sistema híbrido IA para incidencias de parking |
| Aporta | Capa VoIP/SIP, telefonillos, acceso a managers de parking |
| Campo de pruebas | Un cliente de Lorenç prestaría su parking para testeo |

## Modelo de colaboración

Lorenç no es un cliente tradicional que contrata un servicio. Es un **partner estratégico** que:

1. **Aporta el acceso al mercado**: sus clientes actuales (managers de parking) son los usuarios finales
2. **Aporta la capa de telefonía**: infraestructura VoIP, SIP trunking, integración de telefonillos
3. **SOM-OS.dev aporta el cerebro**: IA conversacional, app de gestión de incidencias, dashboard, conector con sistemas de parking
4. **Validación conjunta**: un parking real como campo de pruebas

Este modelo recuerda al de [[06 - Proyectos/Valor Balear|Valor Balear]] donde hay múltiples actores y el valor está en la integración. La diferencia es que acá el partner técnico (Lorenç) es quien abre la puerta al mercado.

## El problema que resuelve

### Situación actual (dolor del manager de parking)

```
Usuario tiene una incidencia en el parking:
  • No lee la matrícula
  • No abre la barrera
  • El ticket no funciona
  • Se pasó del tiempo y no sabe cuánto pagar
  ↓
Pulsa el telefonillo de ayuda
  ↓
Un operador humano atiende (si hay)
  ↓
El operador:
  • Pregunta matrícula, hora de entrada, qué pasa
  • Busca en el sistema de gestión
  • Toma una decisión (abrir barrera, aplicar descuento, etc.)
  ↓
Tiempo medio de resolución: 2-5 minutos por incidencia
Horas punta: colapso del telefonillo, esperas, quejas
```

### Dolor específico

- **Coste de personal 24/7**: un parking pequeño/mediano no puede pagar operadores de madrugada
- **Inconsistencia**: cada operador resuelve distinto, no hay criterio unificado
- **No hay trazabilidad**: ¿quién abrió la barrera? ¿por qué? ¿era un abuso?
- **Barrera idiomática**: turistas que no hablan español/catalán. El parking de al lado de un hotel recibe 15 idiomas distintos al día

## Implicaciones para SOM-OS.dev

### 1. Proyecto alineado con el ADN

[[Conceptos/Concepto Central Actualizado - De componentes aislados a sistemas operativos inteligentes|El concepto central]] habla de transformar componentes aislados en sistemas operativos inteligentes. Este proyecto es literalmente eso:

- **Componentes aislados**: telefonillo, sistema de barreras, ERP de parking, operador humano, matrícula
- **Sistema operativo**: una IA que los integra todos y toma decisiones

### 2. Validación del modelo de negocio

Hasta ahora, SOM-OS.dev ha trabajado con software puro (webs, CRMs, dashboards). Este proyecto introduce:

- **Hardware**: tablets, telefonillos físicos
- **Telecomunicaciones**: VoIP, SIP trunking
- **Protocolos industriales**: comunicación con controladoras de barreras (Modbus, relays, APIs propietarias)

Es el tipo de proyecto que demuestra que SOM-OS.dev no hace "páginas web con IA" — hace [[Conceptos/Propuesta de Valor - Sistemas operativos empresariales|sistemas operativos empresariales]] que integran lo físico con lo digital.

### 3. El conector universal de parkings

El mayor desafío técnico (y la mayor oportunidad) es el **conector** entre la app de SOM-OS.dev y los sistemas de gestión de parkings. No hay un estándar unificado — cada fabricante (Scheidt & Bachmann, SKIDATA, ParkHelp, Zeag, Designa, etc.) tiene su propio protocolo, y muchos parkings pequeños usan sistemas a medida o legacy.

La estrategia sería:

1. **Fase 1 — Conector para el parking de pruebas**: desarrollar un adaptador específico para el sistema concreto del parking que nos prestan como campo de pruebas
2. **Fase 2 — Abstracción**: extraer una capa de abstracción (interfaz común) con operaciones estándar: `abrirBarrera()`, `consultarMatricula()`, `calcularTarifa()`, `registrarIncidencia()`
3. **Fase 3 — Conectores modulares**: cada nuevo parking implementa su adaptador contra la interfaz común

Esto es análogo a lo que Stripe hizo con pagos: una API unificada sobre un ecosistema fragmentado de gateways bancarios. El valor a largo plazo no está en el primer conector — está en ser **el estándar de facto** para integrar IA en parkings.

### 4. Arquitectura híbrida como ventaja competitiva

La mayoría de soluciones de IA para parkings en el mercado son solo chatbots en web/app. La propuesta de Lorenç + SOM-OS.dev cubre dos escenarios que la competencia no toca:

| Canal | Cuándo se usa | Tecnología | Ventaja |
|-------|--------------|------------|---------|
| **Tablet / Kiosko** | Usuario de pie (máquina de pago, junto a puerta peatonal) | PWA o app nativa, teclado táctil, lector QR | Multilenguaje, accesible, sin esperas |
| **Telefonillo IA** | Usuario en coche (no puede bajarse, cola detrás) | VoIP + STT + IA + TTS | Sin fricción, manos libres, mismo hardware existente |

### 5. Roadmap natural

```
Parking de pruebas → 3 parkings del mismo manager → managers de la red de Lorenç
```

Una vez validado en un parking real, la expansión es horizontal: mismo conector para parkings del mismo fabricante, nuevo conector para cada fabricante nuevo. El coste marginal de añadir un parking nuevo tiende a cero una vez que el conector de su fabricante existe.

## Relaciones

- [[Conceptos/Concepto Central Actualizado - De componentes aislados a sistemas operativos inteligentes]] — esto ES un sistema operativo de parking
- [[Conceptos/Propuesta de Valor - Sistemas operativos empresariales]] — propuesta de valor exacta para este proyecto
- [[Conceptos/ADN - Tecnología-Tierra]] — tecnología avanzada (IA, VoIP) aterrizada en un problema físico (una barrera que no abre)
- [[Conceptos/Metodología - 5 pasos SOM-OS]] — aplicable al conector universal y la arquitectura híbrida
- [[Conceptos/Diferenciación - Inventor vs Técnico]] — no es un proyecto de "instalar un chatbot", es inventar una nueva capa de integración
- [[09 - Propuestas/Parkings IA - Sistema híbrido de gestión de incidencias]] — propuesta técnica detallada con flujos
- [[08 - Clientes/Sando Capital - Javier Sandoval Haro]] — otro cliente del vault, contraste con modelo B2B
