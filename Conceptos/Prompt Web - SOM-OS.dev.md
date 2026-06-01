---
title: "Prompt Web — SOM-OS.dev"
date: 2026-05-25
tags:
  - prompt
  - som-os.dev
  - web
  - diseño
  - master-prompt
  - nuxt
  - gsap
  - cocomaterial
description: "Master prompt para generar la web de SOM-OS.dev by Adrián Colom & Joan Toni Ramon Crespi. Combina el arquetipo del Arquitecto, el ADN Tecnología-Tierra, la metáfora visual burbuja/nodo/sistema vivo, y la estética Coocomaterial. Stack: Nuxt + Vue 3 + Tailwind + GSAP."
---

# Prompt Web — SOM-OS.dev

> [!info] Para generar la web de SOM-OS.dev
> Pegá este prompt en una IA de generación de código (Claude, GPT-4, Kimi K2.6). Reemplazá lo que necesites. La web de SOM-OS.dev es la carta de presentación del ecosistema: debe transmitir que Adrián Colom y Joan Toni Ramon Crespi no venden tecnología — construyen sistemas operativos empresariales que integran personas, procesos e inteligencia artificial.

---

## 🎨 PROMPT — Web de SOM-OS.dev by Adrián Colom & Joan Toni Ramon Crespi

```markdown
Diseñá y programá la landing page de SOM-OS.dev, el ecosistema fundado 
por Adrián Colom y Joan Toni Ramon Crespi. SOM-OS.dev diseña sistemas 
operativos empresariales que integran personas, procesos e inteligencia 
artificial para que los negocios funcionen como un sistema conectado, 
eficiente y proactivo.

La web debe transmitir el arquetipo del ARQUITECTO (Adrián) y el OJO 
CREATIVO (Joan Toni): un dúo que observa el caos del cliente y construye 
estructura sólida — técnica y visual — para que el negocio circule con 
seguridad. No es un vendedor de tecnología. No es una agencia. Es un 
dúo técnico-creativo que construye sistemas digitales con alma.

El ADN de la marca es TECNOLOGÍA-TIERRA: innovación avanzada (IA, 
sistemas complejos) profundamente aterrizada en la realidad física del 
empresario. Con raíces en Mallorca. Tecnología con peso, con utilidad 
inmediata. Sin frialdad corporativa.

---

EL EQUIPO — DÚO TÉCNICO-CREATIVO

SOM-OS.dev lo construyen dos personas desde Inca, Mallorca. No es una 
agencia de 50 empleados — es un dúo con raíces locales y visión global.

**Adrián Colom — El Arquitecto**
- Rol: Arquitecto de sistemas digitales. Cara visible. Estrategia, 
  consultoría, desarrollo full-stack, IA (AWS/Cisco).
- Superpoder: Transformar caos en sistemas operativos modulares.
- Origen: Inca, Mallorca. Tecnología como refugio desde los 9 años.
- Hito: La noche de la pizarra (5 junio 2025) — el punto de inflexión 
  donde pasó de reparatodo a constructor.

**Joan Toni Ramon Crespi — El Ojo Creativo**
- Rol: Desarrollo web, LLMOps, IA generativa, producción visual y 
  fotografía. 12+ años fotografiando hoteles, productos, obras de arte 
  en Baleares.
- Superpoder: Hacer que la tecnología se vea y se sienta bien. 
  Conectar el ojo creativo con la automatización técnica.
- Origen: Inca, Mallorca. Transición del mundo visual a la IA 
  generativa (LangChain, LLMOps, Instituto IA).

La historia: Adrián encontró en la tecnología un refugio durante una 
etapa de aislamiento. Joan Toni vio en la IA generativa el puente entre 
su ojo creativo y la automatización. Juntos construyen el ecosistema 
SOM-OS.dev para que otros empresarios no caminen solos.

---

IDENTIDAD VISUAL — METÁFORA CENTRAL

La metáfora visual de SOM-OS.dev es la BURBUJA / NODO / SISTEMA VIVO.
Un negocio es un sistema cerrado que primero se organiza internamente y 
luego se conecta con el exterior. Esta metáfora debe estar presente en 
toda la web, no como decoración sino como lenguaje visual estructural.

Las 4 fases de evolución que representa SOM-OS.dev:
1. CAOS — elementos sueltos, información dispersa, desorden analógico
2. DIGITALIZACIÓN — aparece una estructura, se agrupa la información, 
   nace la "burbuja" (núcleo del negocio)
3. SISTEMA OPERATIVO — capas organizadas, flujo interno, todo conectado 
   dentro del sistema
4. EXPANSIÓN — el sistema se conecta con el exterior, APIs, ecosistema

Estas 4 fases deben aparecer visualmente en alguna sección de la web 
(no necesariamente las 4 — mínimo la transición del caos al sistema).

---

ILUSTRACIONES — COOCOMATERIAL

Usar ilustraciones SVG dibujadas a mano de Coocomaterial. A diferencia 
de otros proyectos donde Coocomaterial aporta calidez, aquí aporta 
HUMANIDAD al mundo tecnológico. El contraste entre lo dibujado a mano 
y lo digital es intencional: refleja el ADN Tecnología-Tierra.

Buscar ilustraciones:
GET https://cocomaterial.com/api/vectors/?tags=connection,technology,team,person&page_size=40
GET https://cocomaterial.com/api/tags/ (para ver todas las etiquetas)

Tags recomendados: connection, link, web, technology, team, group, person, 
people, idea, innovation, building, office, laptop, desktop, hand, deal, 
success, goal, target, system

Fuentes desde GET https://cocomaterial.com/api/resources/:
- Cocomaterial-regular.otf → guardar en /public/fonts/
- Cocomaterial_Icon.otf → guardar en /public/fonts/

NO usar las fuentes Coocomaterial como tipografía principal. Usarlas 
SOLO para:
- El nombre "SOM-OS" en el logo/navbar
- Palabras de acento dentro de titulares (máximo 1-2 por sección)
- Iconos decorativos en badges y pasos de proceso

---

HERO SECTION

Composición a pantalla completa. La metáfora visual debe estar presente 
desde el primer frame.

Plano fondo: textura de papel sutil (SVG noise filter al 3%). Fondo 
cálido pero limpio — evocar piedra mallorquina, no frío tecnológico.

Plano medio-izquierdo: el titular en Playfair Display. Algo como:
"Diseñamos sistemas operativos que integran"
"personas, procesos e inteligencia artificial"
Donde "sistemas operativos" aparece en un peso diferente o con un 
tratamiento visual distintivo (no CocoMaterial — mantenerlo elegante).

Plano medio-derecho: una ilustración Coocomaterial que muestre conexión 
o sistema (tags: connection, system, link). La ilustración debe tener 
nodos/puntos conectados por líneas, o personas conectadas entre sí. 
Drop-shadow suave.

Plano frontal: badge con "Mallorca · Baleares" o similar, anclando el 
ADN Tecnología-Tierra. Debajo del titular, una frase que capture la 
propuesta de valor: "De componentes aislados a sistemas operativos 
inteligentes."

Dos botones: "Ver proyectos" (primario) y "Cómo funciona" (secundario 
con borde suave). NO usar hand-drawn-border aquí — SOM-OS.dev es más 
estructural que artesanal.

Indicadores de confianza debajo: "Metodología de 5 pasos", "IA 
integrada", "Ecosistema modular" con iconos de CocoMaterial Icon.

Navbar: sticky, backdrop-blur al hacer scroll. Logo "SOM-OS" en 
CocoMaterial Regular a la izquierda. Links: Proyectos, Metodología, 
El equipo, Contacto. Botón "Empezar" a la derecha.

---

SECCIÓN — DE CAOS A SISTEMA (LA METÁFORA)

Esta es LA sección diferencial. Debe mostrar visualmente la transición 
del caos al sistema operativo.

Usar una secuencia animada o 4 viñetas que muestren:
1. Elementos sueltos flotando (iconos de herramientas: Excel, WhatsApp, 
   email, Trello) — fondo ligeramente caótico
2. Los elementos empiezan a agruparse alrededor de un núcleo central
3. El núcleo se organiza en capas concéntricas ordenadas
4. Del sistema salen conexiones hacia el exterior (APIs, web, clientes)

La animación de esta sección es el centro emocional de la web. Usar 
GSAP ScrollTrigger para que la transición avance con el scroll. No es 
un vídeo — son elementos DOM que se transforman.

Alternativa simplificada si la animación completa es muy compleja: 
4 tarjetas en grid que representen cada fase, con una ilustración 
Coocomaterial y un texto breve. Las tarjetas se revelan secuencialmente 
al hacer scroll.

---

SECCIÓN — METODOLOGÍA (LOS 5 PASOS)

Título: "Metodología SOM-OS" con "5 pasos" en CocoMaterial Regular.

Grid de 5 tarjetas o timeline vertical con los pasos:
1. Descubrimiento — Entendemos tu negocio, procesos, objetivos y usuarios
2. Estrategia y planificación — Definimos la arquitectura digital y los 
   módulos necesarios
3. Desarrollo — Construimos tu ecosistema digital sobre una base sólida
4. Lanzamiento — Desplegamos, configuramos analítica y monitorización
5. Iteración y mejora — Mejoramos con datos reales a través de membresía

Cada paso tiene: número en CocoMaterial Icon dentro de un círculo, 
título en Inter bold, descripción breve. Conectados por una línea 
vertical animada (scaleY 0→1 al scroll).

Iconos de CocoMaterial Icon para cada paso (elegir de la fuente de 
iconos — usar caracteres que evoquen cada fase: lupa, engranaje, 
cohete, check, ciclo).

---

SECCIÓN — ECOSISTEMA DE PROYECTOS

Título: "Ecosistema SOM-OS" con "modular" en CocoMaterial.

Mostrar los proyectos del ecosistema como un sistema interconectado, 
no como una lista. La metáfora visual: nodos conectados.

Proyectos a mostrar (cada uno es una tarjeta o nodo):
- Foundation — Plantilla modular SaaS (base técnica)
- CanvasAPI — Generación de documentos PDF/JSON
- SOM Tap — Tarjeta de visita digital inteligente
- SOM-OS CRM — Motor de inteligencia comercial
- Atenfy — Chatbot inteligente
- GenLegalTxts — Generación de documentos legales
- CommitWear — Ropa para developers

Cada tarjeta muestra: nombre del proyecto, una frase descriptiva, 
y un indicador visual de si usa IA, si es open source, etc.

Disposición: grid de tarjetas con líneas conectoras sutiles entre 
ellas (SVG o CSS). Al hacer hover en una tarjeta, las líneas que la 
conectan se iluminan con el color de acento.

---

SECCIÓN — EL EQUIPO

Título: "El equipo" o "Quiénes somos" con "somos" en CocoMaterial.

Layout de dos tarjetas lado a lado (desktop) o apiladas (mobile):

**Tarjeta Adrián — El Arquitecto**
- Foto o avatar de Adrián
- Nombre y rol: "Adrián Colom — Arquitecto de sistemas"
- Bio corta (2-3 líneas): "De reparatodo a constructor. Pasé de apagar 
  fuegos a diseñar raíles. Mallorca como raíz. La tecnología como 
  refugio desde los 9 años."
- Hito: "5 junio 2025 — La noche de la pizarra"
- Cita: "No vendo código. Vendo claridad, estructura y libertad para 
  crecer."

**Tarjeta Joan Toni — El Ojo Creativo**
- Foto o avatar de Joan Toni
- Nombre y rol: "Joan Toni Ramon Crespi — IA Generativa & Producción visual"
- Bio corta (2-3 líneas): "12 años fotografiando la esencia de Baleares. 
  La IA generativa me devolvió el puente entre el ojo creativo y la 
  automatización técnica."
- Hito: "Transición visual → IA (LangChain, LLMOps)"
- Cita: "La tecnología debe verse tan bien como funciona."

Ambas tarjetas conectadas visualmente por una línea sutil que simbolice 
la unión de lo técnico y lo visual. No usar hand-drawn-border — líneas 
limpias y estructurales.

---

SECCIÓN — CONTACTO / CTA FINAL

Fondo: ilustración Coocomaterial sutil de conexión o sistema.

Título: "¿Hablamos?" o "Construyamos tu sistema operativo"

Formulario simple: nombre, email, mensaje. Campos con borde inferior 
sutil que se ilumina con el color de acento al focus.

Opcional: botón para agendar llamada (Cal.com).

Debajo: "También podés escribirnos directamente a adriancolom@gmail.com 
o a joan.toni@som-os.dev (reemplazar por el email real de Joan Toni)"

---

FOOTER

Links: Proyectos · Metodología · El equipo · Contacto
Nombre "SOM-OS" en CocoMaterial a la izquierda.
"Mallorca, Baleares" debajo como ancla territorial.
Iconos de redes sociales (GitHub, LinkedIn, Twitter/X) outline.
"© 2026 SOM-OS.dev by Adrián Colom & Joan Toni Ramon Crespi"

---

COLOR PALETTE

La paleta debe evocar Tecnología-Tierra: ni frío tecnológico, ni rústico 
campestre. Un punto intermedio que refleje innovación con raíces.

Fondo principal: tono piedra cálido (#FAFAF9 o similar) — evocar la 
piedra de Mallorca, no el blanco aséptico de una SaaS.
Texto principal: negro roto (#292524) — nunca #000 puro.
Acento primario: un azul profundo mediterráneo (#1E3A5F o similar) — 
el mar y el cielo de Baleares, pero con peso.
Acento secundario: un terracota o ámbar suave — la tierra, la calidez.
Bordes y líneas: gris piedra medio.
Éxito / positivo: verde oliva apagado.

La paleta NO debe ser:
- Azul eléctrico / cyan (demasiado tech)
- Negro puro / blanco puro (demasiado corporativo)
- Colores neón (demasiado startup)

---

TYPOGRAPHY

Títulos principales: Playfair Display (Google Fonts) — serif elegante. 
Transmite la solidez del Arquitecto. Pesos 400, 600, 700.
Cuerpo de texto: Inter (Google Fonts) — sans-serif limpio. Pesos 300-700.
Acentos y logo: CocoMaterial Regular (local .otf) — solo para 
"SOM-OS", palabras clave en titulares (máximo 2 por sección), y 
números destacados.
Iconos decorativos: CocoMaterial Icon (local .otf) — badges, números 
de paso, bullets decorativos.
Datos y números: Inter con tabular-nums.

NO usar CocoMaterial en:
- Texto corrido o párrafos (es ilegible para más de 3 palabras)
- Títulos completos (rompe la elegancia)
- Navegación o elementos funcionales

---

MOTION SYSTEM

GSAP (gsap + ScrollTrigger) para todas las animaciones de scroll.
CSS transitions para micro-interacciones y hovers.

Hero: el titular aparece con text split por palabras (stagger 150ms). 
La ilustración hace fade-in + scale(0.95→1) simultáneo.

Sección CAOS → SISTEMA: animación coreografiada con ScrollTrigger 
scrub. Los elementos sueltos flotan erráticamente al inicio y se 
ordenan progresivamente según el scroll avanza. Usar GSAP timeline 
con scrub: true.

Revelado de secciones: fade-up estándar (y: 40→0, opacity 0→1) 
con stagger de 100ms entre hijos. Easing: power2.out.

Tarjetas de proyecto: hover con translateY(-6px) + shadow. Sin 
rotación (SOM-OS.dev es más estructural que Sando Capital). 
Transición: 300ms cubic-bezier(0.16, 1, 0.3, 1).

Líneas conectoras del ecosistema: al hacer hover en una tarjeta, 
las líneas que la conectan con otras se iluminan secuencialmente.

Línea de timeline (metodología): scaleY(0→1) al scroll.

Navbar: al hacer scroll > 100px, añade backdrop-blur + border-bottom 
+ shadow suave. Transición 300ms.

Botones: hover con scale(1.03) + transición de color. Sin ripple 
efect (demasiado playful para el tono estructural del equipo).

Parallax suave: la ilustración del hero se mueve al 30% de la 
velocidad del scroll. Nada agresivo.

---

TECH STACK

Nuxt 3/4 (Vue 3, Composition API, TypeScript)
Tailwind CSS 4
GSAP (gsap + ScrollTrigger) como plugins de Nuxt
Chart.js (si se incluye alguna visualización de datos)
Fuentes: Playfair Display + Inter (Google Fonts), CocoMaterial (local)
Ilustraciones: Coocomaterial (SVG inline desde API o archivos locales)

---

CRITICAL IMPLEMENTATION NOTES

1. La metáfora BURBUJA/NODO/SISTEMA no es opcional. Debe leerse en la 
web sin necesidad de explicación. Si alguien ve la web y no entiende 
que SOM-OS.dev organiza el caos en un sistema, el diseño falló.

2. El ADN Tecnología-Tierra se manifiesta en: paleta de colores (piedra 
+ mediterráneo), mención a Mallorca, y el contraste entre ilustraciones 
dibujadas a mano (tierra) y estructura visual limpia (tecnología).

3. CocoMaterial aquí tiene un rol diferente al de Sando Capital. En 
Sando Capital aporta calidez. Aquí aporta HUMANIDAD a la tecnología. 
Usar con más moderación aún.

4. La sección CAOS → SISTEMA es el centro emocional. Si se hace bien, 
es la sección que la gente recuerda. Si se hace mal, es un gimmick. 
Invertir tiempo en que la animación sea fluida y el mensaje claro.

5. GSAP ScrollTrigger debe registrarse con matchMedia para responsive. 
Las animaciones complejas (caos→sistema) solo en desktop.

6. NO usar hand-drawn-border. SOM-OS.dev no es artesanal — es 
arquitectónico. Líneas limpias, bordes sutiles, geometría clara.

7. La web NO debe parecer una SaaS genérica. Nada de gradientes 
azul-violeta, ilustraciones corporativas de personas con cascos, 
o métricas flotantes estilo startup.

8. La web debe tener secciones en lugar de páginas separadas (one-page 
con scroll navigation), pero preparada para crecer a múltiples páginas 
cuando el ecosistema lo requiera.

9. El equipo debe leerse como un DÚO complementario, no como una 
sola persona. Adrián es el Arquitecto (estructura, lógica, backend). 
Joan Toni es el Ojo Creativo (visual, IA generativa, fotografía). 
La web debe mostrar ambos perfiles con igual peso visual aunque 
Adrián sea la cara visible. El contraste entre ambos fortalece 
la propuesta: sistema + alma.

10. La producción visual (fotografía profesional, IA generativa 
aplicada a contenido, flujos visuales) es parte integral de la 
propuesta de valor de Joan Toni. No debe tratarse como un servicio 
aparte sino como un pilar del ecosistema SOM-OS: tecnología que 
se ve tan bien como funciona.
```
