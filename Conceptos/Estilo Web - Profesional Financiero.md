---
title: "Estilo Web — Profesional con alma artesanal"
date: 2026-05-25
tags:
  - diseño
  - estilo-web
  - prompt
  - reutilizable
  - cocomaterial
  - animaciones
  - gsap
  - tailwind
description: "Master prompt de estilo reutilizable que combina seriedad profesional con calidez artesanal. Usa Coocomaterial (ilustraciones y fuentes), Playfair Display + Inter, bordes dibujados a mano, textura de papel y GSAP. Aplicable a cualquier sector que necesite confianza y cercanía."
---

# Estilo Web — Profesional con alma artesanal

> [!info] Master prompt de estilo reutilizable
> Este documento define la dirección estética para webs que necesitan transmitir **seriedad profesional sin perder calidez humana**. La clave está en el contraste: tipografía elegante + ilustraciones dibujadas a mano + animaciones sutiles + texturas tangibles. Los colores y sector se definen por proyecto. El resto es transversal.

---

## Prompt para IA de diseño

Copiá este bloque y pegalo al iniciar un nuevo proyecto. Reemplazá `[CLIENTE]` y `[SECTOR]` por lo que corresponda.

```
Diseñá una web para [CLIENTE], del sector [SECTOR], con las siguientes directrices de estilo:

## Estética general
- La web debe sentirse como un objeto bien fabricado: premium pero tangible, no frío ni corporativo.
- El contraste entre lo profesional y lo humano es el eje: tipografía elegante + texturas artesanales + ilustraciones cálidas.
- Espacios generosos. Mucho aire entre secciones. No saturar.
- Las secciones respiran: márgenes verticales amplios (py-20 lg:py-32 en Tailwind).
- Máximo 60-70 caracteres por línea en texto corrido.
- Tarjetas con bordes irregulares dibujados a mano (hand-drawn-border) y sombras suaves.
- Fondo con textura de papel sutil (SVG noise filter al 3-5% de opacidad).

## Estilo visual distintivo — Coocomaterial
Este es el diferenciador clave. NO es una web genérica de finanzas.

### Ilustraciones y recursos — Coocomaterial

Coocomaterial es una librería gratuita de ilustraciones SVG dibujadas a mano. Tiene tres endpoints:

#### 1. Buscar ilustraciones — `/api/vectors/`
```
GET https://cocomaterial.com/api/vectors/?tags=investor&page=1&page_size=40
```
- **`tags`**: filtrar por etiquetas (separadas por coma: `?tags=investor,finance`). La API busca en el campo `tags` de cada vector.
- **`page`** y **`page_size`**: paginación estándar.
- **Respuesta**: `{ "count": 19, "next": null, "previous": null, "results": [...] }`
- **Cada resultado** contiene:
  - `name` — nombre de la ilustración (ej: "Hook", "Investor")
  - `tags` — etiquetas separadas por coma (ej: "investor,finance,chart,person")
  - `svg` — URL del SVG en blanco y negro (ideal para colorear con CSS)
  - `svgContent` — el SVG inline (para incrustar directamente en el HTML)
  - `coloredSvg` — URL del SVG a color (si existe)
  - `coloredSvgContent` — el SVG a color inline

#### 2. Listar etiquetas disponibles — `/api/tags/`
```
GET https://cocomaterial.com/api/tags/
```
- Devuelve TODAS las etiquetas existentes: `[{ "url": "...", "name": "money", "slug": "money" }, ...]`
- Tags útiles para proyectos profesionales: `person`, `people`, `team`, `group`, `success`, `winner`, `goal`, `target`, `idea`, `innovation`, `technology`, `laptop`, `desktop`, `phone`, `email`, `mail`, `office`, `building`, `hand`, `deal`, `link`, `connection`, `web`, `money`, `coins`, `chart`, `bank`, `piggy`, `dollar`, `investor` (según sector)

#### 3. Descargar fuentes — `/api/resources/`
```
GET https://cocomaterial.com/api/resources/
```
- Devuelve dos recursos descargables:
  - `Cocomaterial-regular.otf` — fuente para texto (nombre de marca, palabras de acento, números destacados)
  - `Cocomaterial_Icon.otf` — fuente de iconos (para badges, pasos de proceso, elementos decorativos)
- Descargar y guardar en `/fonts/` del proyecto

#### Flujo de trabajo típico
1. Ir a `https://cocomaterial.com/api/tags/` para ver todas las etiquetas disponibles
2. Buscar ilustraciones con tags relevantes: `?tags=investor`, `?tags=finance+person`, `?tags=chart+money`
3. Elegir las que encajen con cada sección de la landing
4. Descargar los SVG (usar `svg` para B&N o `coloredSvg` para color) o usar `svgContent`/`coloredSvgContent` inline
5. Guardar en `/images/` como `.svg`
6. Descargar las fuentes desde `/api/resources/` a `/fonts/`

#### Uso en la web
- Las ilustraciones reemplazan iconos genéricos y fotos de stock.
- Cada sección principal tiene una ilustración de Coocomaterial: hero, servicios, diferenciador, contacto.
- Las ilustraciones llevan drop-shadow suave: `filter: drop-shadow(0 15px 20px rgba(0,0,0,0.12))`
- Tamaño contenido: max-width 200-300px, nunca dominan la sección.
- Estilo: personajes redondeados, trazos sueltos, colores planos, expresiones amables.

### Fuente CocoMaterial
- Archivos locales: Cocomaterial-regular.otf y Cocomaterial_Icon.otf (en carpeta /fonts/).
- Cocomaterial-regular: para el nombre de la marca, palabras de acento dentro de títulos, números destacados (contadores, precios, KPIs).
- Cocomaterial Icons: para iconos decorativos en badges, pasos de proceso, elementos gráficos.
- NO usar CocoMaterial para texto corrido. Su dominio es el acento, no la lectura.
- Ejemplo de uso en titular: "Hacemos crecer <span class='font-coco'>tu capital</span>"
- Los iconos de CocoMaterial en pasos de proceso van dentro de círculos sólidos (bg oscuro, texto blanco).

## Tipografía
- Fuente para títulos: Playfair Display (Google Fonts). Serif elegante. Pesos 400, 600, 700. Italic disponible para énfasis.
- Fuente para cuerpo: Inter (Google Fonts). Pesos 300 (notas), 400 (cuerpo), 500-600 (subtítulos), 700 (énfasis).
- Fuente para acentos: CocoMaterial (local). Solo en palabras clave, nombre de marca, cifras destacadas.
- Fuente para datos y números: Inter con tabular-nums activado. NO monoespaciada (rompe la calidez).
- Escala tipográfica:
  - Hero título: text-5xl lg:text-6xl xl:text-7xl (Playfair Display, bold)
  - Títulos de sección: text-4xl lg:text-5xl (Playfair Display, bold)
  - Subtítulos de sección: text-xl (Inter, regular, color secundario)
  - Cuerpo: text-lg (Inter, leading-relaxed)
  - Badges y labels: text-sm (Inter, semibold, uppercase, tracking-wider)
  - Notas / letra pequeña: text-sm o text-xs (Inter, light)
- El contraste Playfair (serif, elegante) + Inter (sans, limpio) + CocoMaterial (dibujado, cálido) es intencional.

## Colores (a definir por proyecto)
- Paleta base: tonos piedra cálidos (stone/warm-gray) para fondo y texto. Transmiten solidez sin frialdad.
- Acento: un color vibrante pero sofisticado (oro, terracota, verde oliva, azul profundo). Uno solo, usado con moderación.
- El acento se aplica en: badges, iconos, palabras clave en CocoMaterial, botones primarios, detalles.
- Fondo principal: un tono casi blanco pero cálido (nunca #fff puro).
- Texto principal: negro roto (nunca #000 puro). Más suave a la vista.
- El modo oscuro es opcional. Si se implementa, invertir la paleta piedra.
- Los colores exactos se definen por proyecto. Este prompt no los fija a propósito.

## Bordes dibujados a mano
- Técnica CSS: border-radius irregular.
- Clase .hand-drawn-border:
  border: 2px solid [color];
  border-radius: 2px 255px 3px 25px / 255px 5px 225px 5px;
- Usar en tarjetas de servicio, tarjetas "about", contenedores destacados.
- Versión clara (.hand-drawn-border-light) con borde más suave para fondos oscuros.
- NO abusar. 2-3 elementos por página máximo.

## Textura de papel
- Clase .paper-texture:
  background-color: #fafaf9;
  background-image: url("data:image/svg+xml,...[SVG noise filter al 3% de opacidad]");
- Aplicar al hero o a secciones que necesiten sensación táctil.
- Muy sutil. No debe notarse a simple vista, solo aporta calidez.

## Animaciones
- Biblioteca: GSAP + ScrollTrigger para animaciones al hacer scroll.
- Principio: las animaciones refuerzan la sensación artesanal, no la rompen.
- Hero: animación de entrada por palabras (text split). Cada línea del título aparece secuencialmente.
- Revelado al scroll: las secciones aparecen con fade-up suave (opacity 0 → 1, translateY 40px → 0). Stagger de 100-150ms entre elementos hijos.
- Las tarjetas de servicio tienen hover con translateY(-8px) + rotate(0.5deg) + shadow — sutil pero satisfactorio.
- Parallax suave en la ilustración del hero (velocidad 50% del scroll).
- Contadores animados: de 0 al valor final con easing al entrar en viewport. Usar tabular-nums para que no bailen los dígitos.
- Navbar: sticky, fondo con blur al hacer scroll (backdrop-blur), borde inferior sutil.
- Links del navbar: underline animado que crece de 0 a 100% al hover.
- Botones: efecto ripple al hover (pseudo-elemento que expande desde el centro) + scale(1.05) + rotate(-1deg).
- Línea conectora en sección de proceso: animación scaleX(0 → 1) al hacer scroll.
- Sin animaciones gratuitas. Todo movimiento tiene intención.

## Estructura de landing
- Navbar (sticky, blur al scroll, links con underline animado)
- Hero (textura de papel, ilustración Coocomaterial, texto partido por líneas, badges, CTA)
- Barra de confianza (fondo oscuro, contadores animados con CocoMaterial)
- Nosotros / Quién soy (tarjeta hand-drawn-border, ilustración Coocomaterial, foto o avatar del fundador)
- Servicios / Productos (3 tarjetas con hand-drawn-border, icono ilustrado, lista de features, CTA)
- Cómo funciona / Proceso (3 pasos con círculos numerados, iconos CocoMaterial, línea conectora animada)
- Diferenciador (fondo oscuro con textura de puntos, ilustración, contador circular, bullets con check)
- FAQ (opcional pero recomendado)
- Contacto / CTA final (formulario con campos de borde suave + botón de agendar)
- Footer (links legales, redes, contacto)

## Lo que debe transmitir
- "Esto es profesional, pero no es una corporación fría."
- "Esta persona o equipo es cercano, pero sabe de lo que habla."
- "Cada detalle está cuidado a mano, nada es una plantilla genérica."
- "Me siento seguro y acompañado, no solo vendido."
- "Esto tiene alma. No es una web de plantilla de 50€."
- "La calidez no resta seriedad. La suma."

## Stack técnico (orientativo, varía por proyecto)
- HTML + CSS + JS (con Tailwind CSS y GSAP es suficiente para la mayoría de proyectos)
- Tailwind CSS (CDN para prototipos, build para producción)
- GSAP (gsap + ScrollTrigger) para animaciones
- Fuentes: Playfair Display + Inter (Google Fonts), CocoMaterial (archivos .otf locales)
- Ilustraciones: Coocomaterial (SVG, vía API o archivos locales)
- Si el proyecto requiere backend/CMS/auth, migrar a Nuxt + NestJS manteniendo las mismas librerías visuales
```

---

## Archivos necesarios por proyecto

```
proyecto/
├── fonts/
│   ├── Cocomaterial-regular.otf
│   └── Cocomaterial_Icon.otf
├── images/
│   └── [ilustraciones Coocomaterial en SVG]
├── index.html
└── package.json (solo http-server)
```

---

## Notas para el director de proyecto

- Las ilustraciones de Coocomaterial son el 60% de la personalidad visual. Sin ellas, la web pierde el alma.
- La fuente CocoMaterial debe usarse con moderación (1-3 palabras por sección). Si se abusa, pierde impacto.
- Los bordes dibujados a mano y la textura de papel son el 40% restante. Sin ellos, es una web más del montón.
- Si el cliente no tiene ilustraciones de Coocomaterial, buscar alternativas con estilo similar (dibujado a mano, personajes redondeados, colores planos). NO usar iconos outline genéricos (Heroicons, Lucide) como reemplazo directo.
- Este estilo funciona para: consultoría independiente, servicios profesionales B2C, coaching, salud, bienestar, finanzas personales, inversión, creativos. No funciona para: banca corporativa, seguros tradicionales, legal muy formal, B2B industrial.

---

## 🎨 PROMPT 2 — Master Prompt para webs Coocomaterial

**Cuándo usarlo:** Pegá este prompt en una IA de generación de código (Claude, GPT-4, Kimi K2.6) junto con una imagen de referencia de Pinterest o un diseño Figma. Genera la base de código inicial completa.

**Tip:** Soltá primero la imagen de referencia, después pegá este prompt debajo. Si usás Kimi, MoonViT lee la imagen como parte del mismo pase de razonamiento.

**Antes de pegar:** Reemplazá `[CLIENTE]`, `[SECTOR]`, `[COLOR_PRIMARIO]`, `[COLOR_ACENTO]` y `[EMOCION]` por los valores del proyecto. Las secciones marcadas con `(opcional)` se incluyen o quitan según necesidad.

```markdown
Diseñá y programá una landing page para [CLIENTE], del sector [SECTOR]. 
La web debe transmitir [EMOCION] — profesional pero cercano, serio pero 
con alma. Nada de stock photos genéricas ni templates de agencia. Cada 
detalle debe sentirse artesanal, como un objeto bien fabricado.

---

ILUSTRACIONES — COOCOMATERIAL

Antes de empezar a diseñar, buscá ilustraciones SVG dibujadas a mano 
en la API gratuita de Coocomaterial. Estas ilustraciones SON la 
personalidad visual del sitio.

Para encontrar ilustraciones:
1. Listá todas las etiquetas disponibles: GET https://cocomaterial.com/api/tags/
2. Buscá por tags relevantes: GET https://cocomaterial.com/api/vectors/?tags=[tag1],[tag2]&page_size=40
3. La respuesta incluye { count, results: [{ name, tags, svg, svgContent, coloredSvg }] }
4. Usá `svgContent` o `coloredSvgContent` para incrustar los SVG directamente en el HTML
5. Tags útiles para este proyecto: [TAGS_RELEVANTES]

Descargá las fuentes desde GET https://cocomaterial.com/api/resources/:
- Cocomaterial-regular.otf (para marca, acentos, números destacados)
- Cocomaterial_Icon.otf (para iconos decorativos, badges, pasos de proceso)
Guardalas en /public/fonts/

---

HERO SECTION

Composición a pantalla completa con capas de profundidad. Tres planos:

Plano fondo: ilustración Coocomaterial grande ([ILUSTRACION_HERO]) con 
drop-shadow suave. La ilustración debe ocupar ~40% del ancho en desktop, 
centrada o a la derecha.

Plano medio: el titular principal en Playfair Display. Una o dos palabras 
clave en CocoMaterial Regular con el color de acento. El titular aparece 
con animación de texto partido por palabras (GSAP text split).

Plano frontal: badge con icono de CocoMaterial arriba a la izquierda 
("Intermediario financiero B2C" o el tagline del cliente). Debajo del 
titular, un subtítulo en Inter regular que explique la propuesta de valor 
en una frase. Dos botones: uno primario sólido, otro secundario con borde 
hand-drawn. Debajo, tres indicadores de confianza con checkmarks.

Navbar: sticky, fondo con backdrop-blur al hacer scroll. Logo en 
CocoMaterial Regular a la izquierda. Links con underline animado al 
hover. Botón CTA en la derecha.

Fondo de la sección: textura de papel sutil (SVG noise filter al 3%).

---

(secciones intermedias según proyecto — ej: SERVICIOS, QUIÉN SOY, CÓMO FUNCIONA)

Cada sección usa:
- Título de sección en Playfair Display con palabra de acento en CocoMaterial
- Ilustración Coocomaterial relevante (buscada por tags)
- Tarjetas con borde hand-drawn-border y hover: translateY(-8px) rotate(0.5deg)
- Espaciado generoso: py-20 lg:py-32
- Revelado al scroll: fade-up con stagger de 150ms entre hijos

Las tarjetas de servicio llevan: icono/ilustración Coocomaterial arriba, 
título, lista de features con checkmarks, y botón.

La sección de proceso usa: círculos numerados con iconos de CocoMaterial 
Icon dentro, conectados por una línea animada (scaleX 0→1 al scroll).

La sección diferenciador usa: fondo oscuro con textura de puntos, 
ilustración Coocomaterial, bullets con checkmarks.

---

CONTACTO / CTA FINAL

Formulario de contacto con campos de borde sutil. Foco: anillo del color 
de acento. Botón de envío con efecto ripple al hover. 

Alternativa: botón grande para agendar llamada (integración Cal.com o 
similar) si el cliente prefiere no tener formulario.

---

FOOTER

Links de navegación, nombre de marca en CocoMaterial, iconos de redes 
sociales (outline). Línea divisoria sutil arriba.

---

COLOR PALETTE

Los colores exactos los define el proyecto. Esta es la estructura:

Fondo principal: tono piedra cálido casi blanco ([COLOR_PRIMARIO]) — 
nunca #fff puro, debe sentirse táctil.
Texto principal: negro roto ([COLOR_TEXTO]) — nunca #000 puro.
Acento: [COLOR_ACENTO] — usado con moderación en badges, iconos, 
palabras CocoMaterial, botones primarios, hover states.
Bordes suaves: tono piedra claro.
Notas / letra pequeña: gris medio.

---

TYPOGRAPHY

Títulos: Playfair Display (Google Fonts) — serif elegante, pesos 400-700
Cuerpo: Inter (Google Fonts) — sans-serif limpio, pesos 300-700
Acentos: CocoMaterial Regular (local .otf) — solo 1-3 palabras por 
sección: nombre de marca, palabra clave del titular, números destacados
Iconos decorativos: CocoMaterial Icon (local .otf) — badges, círculos 
de proceso, elementos gráficos
Datos y números: Inter con font-variant-numeric: tabular-nums activado

Escala:
- Hero título: text-5xl lg:text-6xl xl:text-7xl
- Títulos sección: text-4xl lg:text-5xl
- Subtítulos: text-xl
- Cuerpo: text-base lg:text-lg leading-relaxed
- Badges: text-sm uppercase tracking-wider
- Notas legales: text-xs

---

BORDES DIBUJADOS A MANO

Usar en tarjetas de servicio, tarjetas "about", contenedores destacados.
Máximo 2-3 elementos por página. La técnica CSS:

.hand-drawn-border {
  border: 2px solid [color];
  border-radius: 2px 255px 3px 25px / 255px 5px 225px 5px;
}

Versión clara para fondos oscuros: .hand-drawn-border-light

---

TEXTURA DE PAPEL

Aplicar al hero o secciones que necesiten sensación táctil. Muy sutil:

.paper-texture {
  background-color: [color-fondo];
  background-image: url("data:image/svg+xml,...[noise filter al 3%]");
}

---

MOTION SYSTEM

Librería principal: GSAP (gsap + ScrollTrigger) para animaciones al scroll.
Micro-interacciones: CSS transitions (200-300ms ease-out) para hovers.

Hero: las líneas del título aparecen secuencialmente con text split 
(opacity 0 → 1, translateY 100% → 0). Stagger de 150ms entre líneas.

Revelado al scroll: cada sección usa ScrollTrigger con fade-up 
(opacity 0 → 1, y: 40px → 0). Los elementos hijos dentro de cada 
sección usan stagger de 100-150ms.

Parallax: la ilustración del hero se mueve al 50% de la velocidad del 
scroll (GSAP y: valor * 0.5).

Contadores animados: cuando entran en viewport, animan de 0 al valor 
final con easing. Usar tabular-nums para dígitos estables.

Tarjetas hover: translateY(-8px) + rotate(0.5deg) + shadow, 
transición 400ms cubic-bezier(0.34, 1.56, 0.64, 1).

Botones hover: efecto ripple (pseudo-elemento que expande desde el 
centro) + scale(1.05) + rotate(-1deg).

Navbar: al hacer scroll, backdrop-blur + borde inferior + shadow suave.
Links del navbar: underline animado que crece de 0 a 100% al hover.

Línea conectora (proceso): scaleX(0 → 1) al hacer scroll, con 
transform-origin: left center.

Easing estándar: cubic-bezier(0.34, 1.56, 0.64, 1) — snap sutil, 
nunca abrupto. Para revelados al scroll usar ease-out estándar.

En móvil: reducir distancia de parallax a la mitad. Desactivar 
efectos de tilt/rotate en hover (no funcionan bien con touch).

---

TECH STACK

Nuxt 3/4 (Vue 3, Composition API, TypeScript)
Tailwind CSS 4
GSAP (gsap + ScrollTrigger) — instalados como plugins de Nuxt
@vueuse/motion para micro-interacciones Vue (opcional, GSAP cubre el 90%)
Chart.js (solo si el proyecto tiene calculadoras/gráficos)
Fuentes: Playfair Display + Inter (Google Fonts), CocoMaterial (local .otf)
Ilustraciones: Coocomaterial API (SVG inline o locales)

Estructura de archivos esperada:
```
/components/
  /landing/
    HeroSection.vue
    ServicesSection.vue
    ProcessSection.vue
    ContactSection.vue
    AppFooter.vue
/pages/
  index.vue (compone las secciones)
/public/
  /fonts/
    Cocomaterial-regular.otf
    Cocomaterial_Icon.otf
  /images/
    [ilustraciones Coocomaterial SVG]
```

---

CRITICAL IMPLEMENTATION NOTES

1. Las ilustraciones de Coocomaterial SON la personalidad. Sin ellas, la 
web pierde el 60% de su impacto visual. Buscar al menos 4-5 ilustraciones 
distintas (hero, servicios, diferenciador, contacto).

2. CocoMaterial Regular se usa en 1-3 PALABRAS por sección. Si aparece más, 
pierde impacto. Su dominio es el acento, no la lectura.

3. El contraste de tres tipografías es intencional: Playfair (elegancia) 
+ Inter (claridad) + CocoMaterial (calidez). No añadir más fuentes.

4. Los bordes hand-drawn-border y la textura de papel son el 40% restante 
de la personalidad. Sin ellos, la web pierde el toque artesanal.

5. GSAP ScrollTrigger debe registrarse con matchMedia para responsive:
gsap.matchMedia().add("(min-width: 768px)", () => { ... animaciones desktop ... })

6. Las animaciones en móvil deben ser sutiles. Reducir distancia de 
parallax, desactivar efectos de rotación en hover.

7. NO usar iconos outline genéricos (Heroicons, Lucide, Font Awesome) como 
reemplazo de las ilustraciones Coocomaterial. Si no hay ilustración 
disponible, usar CocoMaterial Icon para elementos pequeños y buscar una 
ilustración alternativa con estilo similar (dibujado a mano, personajes 
redondeados, colores planos).
```


---

## Relaciones

- [[06 - Proyectos/Foundation]] — base técnica alternativa si se necesita backend (CMS, auth, etc.)
