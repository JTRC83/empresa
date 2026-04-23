---
title: "CanvasAPI"
tags:
  - proyecto
  - producto
  - api
  - canvas
  - json
  - ia
  - editor
  - template-engine
  - generación-visual
  - pdf
  - som-u
  - ecosistema
category: proyecto
url: https://canvas.ikiraisolutions.com/
status: activo
---

# CanvasAPI (CanvaEditor)

> [!info] Visión general
> CanvasAPI (marca comercial: **CanvaEditor**) es un motor de templates visual API-first que permite generar imágenes y PDFs a escala. Combina un editor visual de canvas con exportación a JSON, renderizado vía API, y capacidad de generación automática con IA.

## Qué es

- **API-First Template Engine** — Motor de plantillas visuales orientado a API
- **Editor visual de canvas** — Interfaz gráfica para diseñar templates (simil Canva/Figma ligero)
- **JSON ↔ Canvas bidireccional** — Los canvas se transforman en JSON y viceversa
- **Renderizado vía API** — Generación programática de imágenes y PDFs desde templates
- **Generación con IA** — La IA puede crear imágenes a partir de los canvas
- **Escalabilidad** — Genera miles de imágenes personalizadas programáticamente

## Casos de uso

- Generación masiva de imágenes personalizadas (certificados, tarjetas, flyers)
- Documentos PDF programáticos (facturas, contratos, reportes)
- Formularios visuales dinámicos
- Mockups automatizados
- Arte generativo
- Contenido visual para marketing a escala
- Tarjetas de presentación personalizadas

## Características principales

### Editor Visual
- Interfaz tipo "Canva" en el navegador
- Templates predefinidos
- Configuración de canvas (tamaño, fondo)
- Importación/Exportación JSON
- Exportación a imagen/PDF

### API
- Renderizado programático de templates
- Inyección de datos dinámicos en templates
- Generación masiva de imágenes/PDFs
- Integración con hojas de cálculo o formularios

### Integración con IA
- La IA puede crear y modificar imágenes basándose en canvas
- Posible integración con modelos de generación de imágenes
- Automatización de flujos visuales

## Arquitectura

```
Editor Visual → JSON (template definition)
                     ↓
              API Request (datos + template)
                     ↓
              Render Engine → Imagen / PDF
```

## Plataformas soportadas

- **Web** — Editor principal y dashboard
- **iOS** — App móvil (según footer web)
- **Android** — App móvil (según footer web)

## Desarrollador

Diseñado y desarrollado por **Adrián Colom Palacios**

## URLs

- **Web:** https://canvas.ikiraisolutions.com/
- **Dashboard:** Accesible desde la web principal
- **API Docs:** Botón "View API Docs" disponible en la landing

## Relaciones

- Parte del ecosistema SOM-U
- Podría integrarse con [[Foundation]] como base técnica
- Complementa a [[Atenfy]] para generación de contenido visual automatizado
- Potencial uso en [[GenLegalTxts]] para generación de documentos visuales
