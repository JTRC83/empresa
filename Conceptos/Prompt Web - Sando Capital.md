---
title: "Prompt Web — Sando Capital"
date: 2026-05-25
tags:
  - prompt
  - sando-capital
  - web
  - diseño
  - master-prompt
  - cocomaterial
  - calculadoras-financieras
  - javier-sandoval
description: "Master prompt para generar la web de Sando Capital by Javier Sandoval Haro. Combinación del estilo Coocomaterial (profesional con alma artesanal) con la paleta de marca de Sando Capital y la analogía central del agua/fluir. Incluye 7 calculadoras financieras interactivas."
---

# Prompt Web — Sando Capital

> [!info] Para generar la web de Sando Capital
> Pegá este prompt en una IA de generación de código (Claude, GPT-4, Kimi K2.6). Reemplazá lo que necesites. La web de Sando Capital es la carta de presentación de Javier Sandoval Haro como intermediario financiero B2C: debe transmitir confianza profesional sin perder cercanía humana. El ticket de entrada es alto (25.000 € mínimo) — la web debe proyectar solidez, no frialdad corporativa.

---

## 🎨 PROMPT — Web de Sando Capital by Javier Sandoval Haro

```markdown
Diseñá y programá la landing page de Sando Capital, la marca de 
Javier Sandoval Haro, intermediario financiero B2C. Sando Capital 
conecta a inversores particulares con empresas de inversión que 
tienen condiciones preferentes, eliminando la barrera entre el 
inversor retail y los vehículos de alto rendimiento.

La web debe transmitir: "Sé de finanzas, pero también sé que 
tu dinero es tu tiempo y tu esfuerzo. No voy a tratarte como 
un número."

El ADN de Sando Capital es **FLUIR**: el dinero, como el agua, 
debe moverse para mantenerse vivo. La metáfora central del agua 
aparece en toda la web — no como decoración, sino como lenguaje 
emocional.

---

ANALOGÍA CENTRAL — EL DINERO COMO AGUA

Esta es la columna vertebral del texto. Javier Sandoval usa esta 
analogía naturalmente. La web debe respirarla en cada sección:

- "Tu dinero tiene que trabajar igual que el agua: fluir."
- "Tener dinero en el banco parado es como que el agua esté 
   estancada. Deja de ser útil."
- "El mejor momento para invertir fue ayer. El segundo mejor 
   momento es hoy."
- El dinero estancado pierde valor (inflación). El dinero en 
  movimiento genera más dinero.
- El agua clara = transparencia. El agua que fluye = rentabilidad.

Esta analogía debe aparecer en:
- El hero (tagline o frase de apertura)
- La sección de propuesta de valor
- La sección de calculadoras ("hacé fluir tus números")
- El footer

---

IDENTIDAD VISUAL — PALETA DE MARCA

Sando Capital ya tiene una identidad visual definida. Respetarla 
al pie de la letra.

Colores exactos (de la guía de marca):
- **Azul Sando**: #11455a — RGB(20, 69, 90) — el color institucional
- **Verde Sando**: #33a67d — RGB(51, 166, 125) — el color de crecimiento
- **Gradiente**: De azul (#11455a) a verde (#33a67d) en ángulo de 45°
- **Texto principal**: #1a1a1a (negro suave, nunca #000 puro)
- **Fondo**: #FAFAF8 (blanco cálido, ligeramente piedra)
- **Bordes**: #E5E5E0 (gris cálido)

Aplicación de colores:
- Azul Sando: navbar, títulos principales, footer, fondos oscuros
- Verde Sando: acentos, botones primarios, badges, hover states
- Gradiente: hero, secciones destacadas, separadores
- Blanco cálido: fondo general de la web
- El contraste azul + verde es intencional: mar + tierra, 
  estabilidad + crecimiento.

---

ILUSTRACIONES — COOCOMATERIAL

Usar ilustraciones SVG dibujadas a mano de Coocomaterial. En 
Sando Capital, estas ilustraciones aportan CALIDEZ al mundo 
financiero. El contraste entre lo dibujado a mano y los números 
es intencional: finanzas con alma humana.

Buscar ilustraciones:
GET https://cocomaterial.com/api/vectors/?tags=investor,finance,money,chart,person&page_size=40
GET https://cocomaterial.com/api/tags/ (para ver todas las etiquetas)

Tags recomendados: money, coins, chart, bank, piggy, dollar, 
investor, person, people, team, group, success, winner, goal, 
target, idea, innovation, technology, laptop, desktop, phone, 
email, mail, office, building, hand, deal, link, connection

Fuentes desde GET https://cocomaterial.com/api/resources/:
- Cocomaterial-regular.otf → guardar en /public/fonts/
- Cocomaterial_Icon.otf → guardar en /public/fonts/

NO usar las fuentes Coocomaterial como tipografía principal. 
Usarlas SOLO para:
- El nombre "Sando" en el logo/navbar
- Palabras de acento dentro de titulares (máximo 1-2 por sección)
- Iconos decorativos en badges y pasos de proceso

---

HERO SECTION

Composición a pantalla completa. La metáfora del agua/fluir debe 
estar presente desde el primer frame.

Plano fondo: textura de papel sutil (SVG noise filter al 3%). 
Fondo cálido (#FAFAF8) — evocar solidez, no frío bancario.

Plano medio-izquierdo: el titular en Playfair Display. 
"Tu dinero no debería estar parado" 
"Debería estar fluyendo."
O alternativa más directa:
"Conectamos tu capital con oportunidades que 
no encontrarás en un banco."

Plano medio-derecho: una ilustración Coocomaterial de una 
persona con monedas, gráfico ascendente, o dinero creciendo 
(tags: investor, money, growth, success). Drop-shadow suave.

Plano frontal: badge con "Intermediario financiero B2C" en 
CocoMaterial Icon. Debajo del titular, una frase que capture 
la analogía: "Tu dinero tiene que trabajar igual que el agua: 
fluir. Estancado, pierde valor."

Dos botones: "Calculá tu rendimiento" (primario, verde Sando) 
y "Agendá una llamada" (secundario con borde suave).

Indicadores de confianza debajo: "Rentabilidad del 15% anual", 
"Inversión desde 25.000 €", "Sin bancos de por medio" con 
iconos de CocoMaterial Icon.

Navbar: sticky, fondo azul Sando (#11455a) al hacer scroll 
(con backdrop-blur). Logo "Sando" en CocoMaterial Regular 
a la izquierda. Links: Inicio, Calculadoras, Cómo funciona, 
Contacto. Botón "Agendar llamada" a la derecha.

---

SECCIÓN — PROPUESTA DE VALOR (LA ANALOGÍA DEL AGUA)

Esta es LA sección diferencial. Debe mostrar visualmente la 
transición del dinero estancado al dinero en movimiento.

Layout: dos columnas.

Izquierda (estancado):
- Fondo ligeramente grisáceo
- Icono/ilustración de agua quieta o charco
- Título: "Dinero parado = Dinero que pierde valor"
- Texto: "La inflación come tu poder adquisitivo cada año. 
  Un depósito al 2% no es rentabilidad: es una pérdida 
  disfrazada."
- Número destacado: "+12% de pérdida acumulada en 5 años" 
  (inflación ~2,5% anual)

Derecha (fluyendo):
- Fondo con gradiente sutil azul→verde
- Icono/ilustración de agua fluyendo, río, o gráfico ascendente
- Título: "Dinero en movimiento = Dinero que trabaja"
- Texto: "Conectamos tu capital con vehículos de inversión de 
  alto rendimiento. Rentabilidad objetivo del 15% anual. 
  Bloqueo mínimo de 1 año."
- Número destacado: "15% anual" en CocoMaterial

Al hacer scroll, la sección revela un flujo visual: de izquierda 
(estancado) a derecha (fluyendo), como un río que despierta.

---

SECCIÓN — CÓMO FUNCIONA (3 PASOS)

Título: "De estancado a fluyendo en 3 pasos" con "3 pasos" en 
CocoMaterial Regular.

Grid de 3 tarjetas con borde hand-drawn-border:

1. Evaluamos tu situación — Analizamos tu capital disponible, 
   horizonte temporal y tolerancia al riesgo. Sin compromiso.
2. Te conectamos — Te acercamos a vehículos de inversión con 
   condiciones preferentes que solo los grandes inversores 
   suelen acceder.
3. Tu dinero fluye — Tu capital empieza a trabajar. Seguimiento 
   mensual. Transparencia total.

Cada paso: número en CocoMaterial Icon dentro de un círculo 
(verde Sando), título en Inter bold, descripción breve. 
Conectados por una línea vertical animada (scaleY 0→1 al scroll).

---

SECCIÓN — CALCULADORAS FINANCIERAS

Título: "Hacé tus números antes de decidir" con "números" en 
CocoMaterial.

Esta sección es clave. Sando Capital incluye 7 calculadoras 
financieras interactivas que el visitante puede usar sin 
compromiso. Las calculadoras son el gancho: educan al usuario 
y lo acercan a la conversión.

Grid de tarjetas (2 columnas en desktop, 1 en mobile):

1. Interés compuesto — "¿Cuánto acumularías si invirtieras 
   X euros al Y% durante Z años?"
2. Independencia financiera — "¿Cuánto necesitás para vivir 
   de tus inversiones?"
3. Jubilación — "¿Llegarás con suficiente capital a tu jubilación?"
4. Simulador de hipotecas — "¿Cuánto pagarías al mes?"
5. Amortización anticipada — "¿Cuánto ahorrás si adelantas 
   capital?"
6. Inflación (IPC) — "¿Cuánto valdrá tu dinero dentro de X años?"
7. Rentabilidad del alquiler — "¿Cuánto renta tu piso de inversión?"

Cada tarjeta muestra: nombre, una frase de valor, y un botón 
"Probar calculadora". Las calculadoras abren en modal o 
sección expandida (no redirigen a otra página).

Diseño de calculadoras:
- Campos de entrada con borde sutil, foco en verde Sando
- Resultados destacados en números grandes (Playfair Display)
- Gráficos simples (Chart.js) cuando aplica
- Botón "Hablá con Javier" debajo de cada resultado

---

SECCIÓN — SOBRE JAVIER SANDOVAL

Título: "Quién está detrás de Sando Capital" con "Sando" en 
CocoMaterial.

Layout de dos columnas:
- Izquierda: foto de Javier Sandoval (fotos de WhatsApp, 
  profesional pero cercana). Si no hay foto, usar ilustración 
  Coocomaterial de una persona con traje pero sonriendo 
  (tags: person, success, professional).
- Derecha: texto editorial en Inter. 3-4 párrafos cortos:
  * "Mi nombre es Javier Sandoval y llevo años en el mundo 
    de las inversiones."
  * "No trabajo para un banco. Soy un intermediario independiente 
    que negocia condiciones preferentes con empresas de inversión 
    y las acerca a personas como vos."
  * "La analogía del agua me la contó un mentor hace años: 
    el dinero, como el agua, debe fluir para mantenerse vivo. 
    Estancado, pierde valor."
  * "Mi trabajo es simple: conectar tu capital con oportunidades 
    que no encontrarás en una sucursal bancaria."

Incluir una cita textual: 
"El mejor momento para invertir fue ayer. El segundo mejor 
momento es hoy."

---

SECCIÓN — BARRA DE CONFIANZA

Fondo azul Sando (#11455a). Texto blanco. Sin ilustraciones 
— solo números y verdad.

Tres contadores animados:
- "15%" — Rentabilidad objetivo anual
- "25k €" — Inversión mínima de entrada
- "1 año" — Bloqueo mínimo de capital

Texto debajo: "Sin bancos de por medio. Sin letra pequeña que 
no entiendas. Sin productos que no necesitás."

---

SECCIÓN — CONTACTO / CTA FINAL

Fondo: gradiente sutil azul→verde con textura de papel.

Título: "¿Hablamos?" o "Hacé que tu dinero fluya"

Formulario simple: nombre, email, teléfono, mensaje (opcional). 
Campos con borde sutil que se ilumina en verde Sando al focus.

Botón de envío: "Quiero que mi dinero trabaje" — primario, 
verde Sando, con efecto ripple al hover.

Alternativa prominente: botón grande para agendar llamada 
(Cal.com): "Agendá una llamada gratuita de 20 minutos"

Debajo: "También podés escribirme directamente a 
javier@sando.capital"

---

FOOTER

Links: Inicio · Calculadoras · Cómo funciona · Contacto
Nombre "Sando" en CocoMaterial a la izquierda.
"Javier Sandoval Haro — Intermediario financiero B2C" debajo.
"© 2026 Sando Capital"
Iconos de redes sociales (LinkedIn, WhatsApp) outline.
Disclaimer legal obligatorio (pequeño): "Sando Capital es un 
intermediario financiero. Las inversiones conllevan riesgo. 
Las rentabilidades pasadas no garantizan rentabilidades futuras."

---

COLOR PALETTE (ESPECÍFICA DE SANDO CAPITAL)

Fondo principal: #FAFAF8 (blanco cálido, nunca #fff puro)
Texto principal: #1a1a1a (negro suave)
Azul institucional: #11455a — navbar, footer, fondos oscuros, 
  títulos principales
Verde crecimiento: #33a67d — acentos, botones primarios, badges, 
  hover states, foco en formularios
Gradiente: linear-gradient(45deg, #11455a, #33a67d)
Bordes suaves: #E5E5E0
Notas / disclaimer: #888888

La paleta NO debe ser:
- Azul eléctrico / cyan (demasiado fintech genérica)
- Rojo (asocia a pérdida, alerta, peligro)
- Dorado / amarillo (demasiado tradicional, banca antigua)
- Colores neón (demasiado startup crypto)

---

TYPOGRAPHY

Títulos principales: Playfair Display (Google Fonts) — serif 
elegante. Transmite solidez y confianza. Pesos 400, 600, 700.
Cuerpo de texto: Inter (Google Fonts) — sans-serif limpio. 
Pesos 300-700.
Acentos y logo: CocoMaterial Regular (local .otf) — solo para 
"Sando", palabras clave en titulares (máximo 2 por sección), 
y números destacados.
Iconos decorativos: CocoMaterial Icon (local .otf) — badges, 
números de paso, bullets decorativos.
Datos y números: Inter con tabular-nums activado.

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

Sección PROPUESTA DE VALOR (estancado→fluyendo): al hacer scroll, 
la columna derecha (fluyendo) se ilumina progresivamente mientras 
la izquierda (estancado) se atenúa sutilmente. GSAP ScrollTrigger 
con scrub.

Revelado de secciones: fade-up estándar (y: 40→0, opacity 0→1) 
con stagger de 100ms entre hijos. Easing: power2.out.

Tarjetas de calculadoras: hover con translateY(-6px) + shadow + 
border-color cambia a verde Sando. Transición: 300ms ease-out.

Contadores animados (barra de confianza): cuando entran en 
viewport, animan de 0 al valor final con easing. tabular-nums 
para dígitos estables.

Navbar: al hacer scroll > 100px, fondo cambia de transparente 
a azul Sando sólido + backdrop-blur + shadow suave. 
Transición 300ms.

Botones: hover con scale(1.03) + transición de color. 
Efecto ripple opcional (verde Sando).

Parallax suave: la ilustración del hero se mueve al 30% de la 
velocidad del scroll.

Línea de timeline (cómo funciona): scaleY(0→1) al scroll.

---

TECH STACK

Nuxt 3/4 (Vue 3, Composition API, TypeScript)
Tailwind CSS 4
GSAP (gsap + ScrollTrigger) como plugins de Nuxt
Chart.js (para gráficos de calculadoras)
Fuentes: Playfair Display + Inter (Google Fonts), CocoMaterial (local)
Ilustraciones: Coocomaterial (SVG inline desde API o archivos locales)
Cal.com (botón de agendar llamada)

Estructura de archivos esperada:
```
/components/
  /landing/
    HeroSection.vue
    ValuePropSection.vue
    HowItWorksSection.vue
    CalculatorsSection.vue
    AboutSection.vue
    TrustBarSection.vue
    ContactSection.vue
    AppFooter.vue
  /calculators/
    CompoundInterestCalculator.vue
    FinancialIndependenceCalculator.vue
    RetirementCalculator.vue
    MortgageCalculator.vue
    AmortizationCalculator.vue
    InflationCalculator.vue
    RentalYieldCalculator.vue
/pages/
  index.vue (compone las secciones)
/public/
  /fonts/
    Cocomaterial-regular.otf
    Cocomaterial_Icon.otf
  /images/
    [ilustraciones Coocomaterial SVG]
    [fotos de Javier Sandoval]
```

---

CRITICAL IMPLEMENTATION NOTES

1. La analogía del AGUA/FLUIR no es opcional. Debe leerse en la 
web sin necesidad de explicación. Si alguien ve la web y no 
siente que el dinero debe moverse, el diseño falló.

2. Las calculadoras financieras SON el gancho de captación. 
Deben ser fáciles de usar, rápidas, y mostrar resultados 
visuales claros. Cada calculadora debe tener un botón "Hablá 
con Javier" que abra Cal.com o el formulario de contacto.

3. CocoMaterial aquí aporta CALIDEZ al mundo financiero. Usar 
con moderación (1-3 palabras por sección). Su dominio es el 
acento, no la lectura.

4. El ticket de entrada es alto (25.000 €). La web NO puede 
parecer una fintech de 5 minutos. Debe proyectar solidez, 
experiencia y confianza. Pero tampoco puede parecer un banco 
tradicional frío.

5. GSAP ScrollTrigger debe registrarse con matchMedia para 
responsive. Las animaciones complejas solo en desktop.

6. Usar hand-drawn-border en tarjetas de calculadoras y pasos 
de proceso. Máximo 3 elementos por página.

7. Textura de papel sutil en hero y sección de contacto. 
Fondo #FAFAF8 con noise filter al 3%.

8. Disclaimer legal obligatorio en footer. Pequeño pero visible. 
Sando Capital opera en un sector regulado.

9. Las fotos de Javier Sandoval deben ser profesionales pero 
cercanas. No retrato corporativo rígido. Sonrisa natural, 
ropa elegante pero no excesiva. Las fotos de WhatsApp son 
la referencia de tono.

10. La sección "Cómo funciona" debe sentirse como un proceso 
clear, no como una venta agresiva. Lenguaje de guía, no de 
presión. "Evaluamos → Conectamos → Tu dinero fluye."
```

---

## Analogías alternativas (si el cliente prefiere otra)

Si Javier decide que la analogía del agua no es la definitiva, 
estas son las opciones reservadas:

1. **El tiempo**: "El tiempo es tu activo más valioso. Nosotros 
   hacemos que tu dinero lo respete."
2. **La semilla/árbol**: "Plantás hoy, cosechás mañana. Pero 
   la tierra correcta importa tanto como la semilla."
3. **El viaje**: "El dinero parado es como un coche sin gasolina. 
   Nosotros le ponemos el motor y el mapa."

La analogía del agua sigue siendo la recomendada por el cliente.

---

## Secciones prioritarias (si hay que reducir scope)

Si el tiempo de desarrollo es limitado, priorizar en este orden:

1. Hero + Navbar (con analogía del agua)
2. Propuesta de valor (estancado vs fluyendo)
3. Calculadoras financieras (mínimo 3: interés compuesto, 
   independencia financiera, inflación)
4. Cómo funciona (3 pasos)
5. Contacto / CTA
6. Footer con disclaimer
7. Sobre Javier
8. Barra de confianza

---

## Relaciones

- [[Estilo Web - Profesional Financiero]] — master prompt Coocomaterial base
- [[08 - Clientes/Sando Capital - Javier Sandoval Haro]] — ficha del cliente
- [[09 - Propuestas/Sando Capital - Presupuesto Web + Sistema]] — presupuesto y scope
- [[06 - Proyectos/Foundation]] — base técnica para CMS y panel de admin
