---
title: "Propuesta Parkings IA — Sistema híbrido de gestión de incidencias"
date: 2026-05-22
tags:
  - propuesta
  - parking
  - ia-conversacional
  - voip
  - integracion-hardware
  - lorenç-prats
status: idea
description: "Propuesta de sistema híbrido para gestión de incidencias en parkings mediante IA. Combina dos canales: tablet/kiosko para usuarios de pie y telefonillo con IA conversacional vía VoIP para usuarios en coche. Integración con sistemas de gestión de parking (barreras, matrículas, tarifas). Colaboración con Lorenç Prats (telecomunicaciones)."
---


> [!info] Visión general
> Sistema que automatiza el 90% de las incidencias en parkings usando IA, con el objetivo de **rentabilizar la operación reduciendo personal presencial y permitiendo gestión remota multi-parking**. Cuando un usuario tiene un problema (barrera que no abre, puerta peatonal bloqueada, ticket no leído, matrícula no reconocida), elige entre dos canales según su contexto: si está de pie usa la tablet/kiosko táctil, si está en el coche habla con la IA por el telefonillo. El sistema consulta en tiempo real los datos del parking (matrícula, hora de entrada, tarifa, permisos de acceso) y ejecuta acciones sobre **barreras, pestillos electrónicos y puertas** — o redirige inteligentemente a un operador remoto con contexto completo. Colaboración: [[08 - Clientes/Lorenç Prats - Telecomunicaciones y Parkings IA|Lorenç Prats]] (VoIP + acceso a managers de parking) + SOM-OS.dev (IA + app + conectores).

---

## Flujo de decisión: ¿qué canal usa el usuario?

```mermaid
flowchart TD
    INCIDENCIA[Usuario tiene una incidencia<br/>Barrera no abre / Puerta peatonal bloqueada<br/>Ticket no lee / Matrícula no reconoce<br/>Pestillo no responde]
    UBICACION{¿Está en el coche?}
    
    INCIDENCIA --> UBICACION
    UBICACION -->|Sí - dentro del coche| TELEFONILLO[Pulsa el telefonillo físico<br/>Llamada VoIP entrante]
    UBICACION -->|No - está de pie| KIOSKO[Tablet / Kiosko táctil<br/>Máquina de pago o junto a puerta<br/>peatonal con pestillo electrónico]
    
    TELEFONILLO --> FLUJO_VOZ[Flujo por Voz]
    KIOSKO --> FLUJO_TACTIL[Flujo Táctil]
```

---

## Flujo 1: Canal táctil (Tablet / Kiosko)

```mermaid
flowchart TB
    START[Usuario se acerca al kiosko<br/>Pantalla táctil interactiva]
    
    subgraph IDENT["Paso 1 — Identificación"]
        OPCIONES{¿Cómo quiere identificarse?}
        MATRICULA[Introducir matrícula<br/>con teclado numérico + letras]
        TICKET[Escanear código QR<br/>del ticket de entrada]
        LLAMADA_MAT[Buscar matrícula<br/>en llamadas recientes]
        
        OPCIONES -->|Escribe matrícula| MATRICULA
        OPCIONES -->|Escanea ticket| TICKET
        OPCIONES -->|Venía de telefonillo| LLAMADA_MAT
    end
    
    subgraph DATOS["Paso 2 — Consulta al sistema del parking"]
        API[API del conector<br/>- Sistema de gestión del parking]
        RESPUESTA{Datos obtenidos}
        DATOS_OK["✅ Muestra:<br/>- Hora de entrada<br/>- Tiempo transcurrido<br/>- Tarifa actual<br/>- Si tiene abono/bonificación"]
        DATOS_KO["⚠️ No se encontró la matrícula<br/>Muestra opciones alternativas"]
    end
    
    subgraph ACCION["Paso 3 — Resolución"]
        TIPO_INCIDENCIA{¿Qué tipo de incidencia?}
        PAGO["Problema de pago<br/>Mostrar tarifa y opciones:<br/>- Pagar con tarjeta/teléfono<br/>- Aplicar código descuento<br/>- Validar ticket"]
        BARRERA["La barrera no abre<br/>Sistema verifica:<br/>- ¿Pago realizado?<br/>- ¿Tiempo límite no excedido?<br/>- ¿Matrícula autorizada?"]
        PESTILLO["Puerta peatonal bloqueada<br/>Sistema verifica:<br/>- ¿Acceso autorizado?<br/>- ¿Horario permitido?<br/>- ¿Tarjeta/acreditación válida?"]
        OTRO["Otra incidencia<br/>Formulario guiado:<br/>- Describir problema<br/>- Subir foto si necesario<br/>- IA clasifica y resuelve o escala"]
    end
    
    subgraph RESULTADO["Resultado"]
        ABRIR[Abrir barrera/pestillo<br/>+ notificación + registro]
        DERIVAR[Derivar a operador remoto<br/>con contexto completo<br/>si la IA no puede resolver]
        TICKET_INC[Generar ticket de incidencia<br/>con trazabilidad completa]
    end
    
    START --> OPCIONES
    MATRICULA --> API
    TICKET --> API
    LLAMADA_MAT --> API
    API --> RESPUESTA
    RESPUESTA -->|Éxito| DATOS_OK
    RESPUESTA -->|No encontrado| DATOS_KO
    DATOS_OK --> TIPO_INCIDENCIA
    TIPO_INCIDENCIA --> PAGO
    TIPO_INCIDENCIA --> BARRERA
    TIPO_INCIDENCIA --> PESTILLO
    TIPO_INCIDENCIA --> OTRO
    PAGO --> ABRIR
    BARRERA --> ABRIR
    PESTILLO --> ABRIR
    OTRO --> DERIVAR
    DERIVAR --> TICKET_INC
```

---

## Flujo 2: Canal de voz (Telefonillo IA)

```mermaid
flowchart TB
    PULSAR[Usuario pulsa el telefonillo<br/>desde dentro del coche]
    
    subgraph VOIP["Capa VoIP — Gestionada por Lorenç"]
        LLAMADA[Llamada VoIP entrante<br/>vía SIP trunking]
        COLA["Si todas las líneas IA ocupadas<br/>- cola de espera con música"]
        CONECTAR[Conectar a línea IA disponible]
    end
    
    subgraph IA_VOZ["Motor de IA conversacional"]
        SALUDO[IA: 'Parking X, ¿cuál es su incidencia?']
        STT[Speech-to-Text<br/>Transcripción en tiempo real<br/>multilenguaje automático]
        
        NLU["Comprensión de lenguaje natural<br/>Clasificación de intención:<br/>- barrera_no_abre<br/>- ticket_perdido<br/>- pago_problema<br/>- matricula_no_reconocida<br/>- emergencia<br/>- otro"]
        
        EXTRACCION["Extracción de entidades:<br/>- Matrícula si la dice<br/>- Nº ticket si lo dice<br/>- Idioma detectado"]
    end
    
    subgraph RESOLUCION["Resolución"]
        BUSCAR[Buscar en sistema del parking]
        DECISION{¿Resoluble?}
        
        RESUELVE["Ejecutar acción:<br/>- Abrir barrera<br/>- Aplicar tarifa<br/>- Validar ticket"]
        HABLA[TTS: confirmación audible<br/>en el idioma del usuario<br/>'Barrera abierta, buen viaje']
        
        NO_RESUELVE["Escalar al encargado en garita:<br/>- Transferir llamada<br/>- Adjuntar contexto<br/>  transcripción, datos parking<br/>- Si no hay encargado: operador remoto"]
    end
    
    PULSAR --> LLAMADA
    LLAMADA --> COLA
    COLA --> CONECTAR
    CONECTAR --> SALUDO
    SALUDO --> STT
    STT --> NLU
    NLU --> EXTRACCION
    EXTRACCION --> BUSCAR
    BUSCAR --> DECISION
    DECISION -->|Sí| RESUELVE
    DECISION -->|No| NO_RESUELVE
    RESUELVE --> HABLA
```

---

## Flujo 2b: Escalado al encargado y operador remoto

Cuando la IA no puede resolver, el sistema escala **primero al encargado en garita** (si está disponible) y solo deriva al operador remoto cuando el encargado no está (noche, valle) o cuando el encargado necesita ayuda con un caso complejo.

```mermaid
flowchart TB
    DETONANTE[IA determina: no resoluble<br/>automáticamente]

    subgraph CONTEXTO["🧠 Empaquetado de contexto"]
        CAPTURA["Capturar todo lo disponible:<br/>- Transcripción de la conversación<br/>- Matrícula, hora de entrada, tarifa<br/>- Imagen de cámara LPR<br/>- Últimas 3 incidencias de esa matrícula<br/>- Canal: tablet o telefonillo<br/>- Idioma del usuario"]
    end

    subgraph RUTEO["🔀 Ruteo inteligente"]
        HAY_ENCARGADO{¿Encargado en garita<br/>disponible?}
        HORARIO{¿Horario diurno?}
        
        ENCOLAR["Encolar para el encargado<br/>con prioridad y timeout<br/>Si no responde en 2 min: aviso sonoro"]
        DERIVAR_REMOTO["Derivar a operador remoto<br/>Noche / valle / encargado ocupado"]
        NOTIFICAR[Notificación + contexto completo]
    end

    subgraph CONSOLA["🖥️ Destino del escalado"]
        PANEL_ENCARGADO["Panel del encargado en garita:<br/>- Recibe incidencia con contexto<br/>- Puede aceptar llamada o ver datos<br/>- Resuelve físicamente o desde garita"]
        CONSOLA_REMOTA["Consola operador remoto:<br/>- Solo horas valle y madrugada<br/>- Mismos controles que el encargado<br/>- Acciones remotas: abrir barrera, pestillo"]
    end

    subgraph POST["📊 Post-resolución"]
        FEEDBACK["Registrar:<br/>- Motivo del escalado<br/>- Acción tomada<br/>- ¿Podría haberse automatizado?"]
        APRENDER["Si mismo patrón se repite N veces<br/>sugerir nueva regla de automatización<br/>entrenar IA con este caso"]
    end

    DETONANTE --> CAPTURA
    CAPTURA --> RUTEO
    HAY_ENCARGADO -->|Sí - diurno| ENCOLAR
    HAY_ENCARGADO -->|No - noche/valle| DERIVAR_REMOTO
    ENCOLAR --> NOTIFICAR
    DERIVAR_REMOTO --> NOTIFICAR
    NOTIFICAR --> PANEL_ENCARGADO
    NOTIFICAR --> CONSOLA_REMOTA
    PANEL_ENCARGADO --> FEEDBACK
    CONSOLA_REMOTA --> FEEDBACK
    FEEDBACK --> APRENDER
```

> [!tip] El encargado es el primer humano, el operador remoto es el backup
> Durante el día, el 15% que la IA no resuelve va directo al encargado en garita. Solo de noche o cuando el encargado está ocupado con otra incidencia física, el sistema deriva al operador remoto.

---

## Modelo de negocio: Rentabilización mediante operación remota

### Las tres capas de resolución

No todas las incidencias son iguales. El sistema distingue tres tipos, y cada uno se resuelve en una capa distinta:

```mermaid
flowchart LR
    INCIDENCIAS[Incidencias totales<br/>~500/mes por parking]

    subgraph CAPA1["🤖 Capa 1: IA — 85%"]
        DIGITAL[Incidencias digitales<br/>Abrir barrera, validar ticket<br/>cobrar, informar estado]
    end

    subgraph CAPA2["👩‍💼 Capa 2: Operador remoto — 10%"]
        JUICIO[Incidencias que requieren juicio<br/>pero NO presencia física<br/>Discutir tarifa, situación ambigua<br/>cámara sucia, autorizar excepción]
    end

    subgraph CAPA3["🔧 Capa 3: Encargado en garita — 5%"]
        FISICO[Incidencias físicas<br/>Barrera atascada, pestillo roto<br/>coche bloqueando salida<br/>derrame, accidente, persona caída]
    end

    INCIDENCIAS --> CAPA1
    INCIDENCIAS --> CAPA2
    INCIDENCIAS --> CAPA3
```

> [!important] El encargado ya está en la garita — es el primer humano en la cadena
> Todos los parkings tienen una persona en la garita. Esa persona **ya existe, ya cobra, ya está allí**. Hoy atiende el 100% de las llamadas del telefonillo. Con el sistema, la IA resuelve el 85% sin que el encargado se entere. El 15% restante **se deriva al encargado** — ya sea la llamada telefónica directamente o una notificación en su panel. El encargado sigue siendo quien resuelve lo que la IA no puede, pero ahora solo interrumpe su trabajo 75 veces al mes en vez de 500.

### El antes y el después

| | Antes (sin sistema) | Después (con Parkings IA) |
|---|---|---|
| **Encargado en garita** | Responde el 100% de llamadas del telefonillo (~500/mes). El 85% son "¿por qué no abre la barrera?" que se resuelven en 30 segundos pero interrumpen constantemente. Hace mantenimiento "cuando puede". | **La misma persona. Mismo sueldo. Mismo turno.** Pero solo recibe ~75 incidencias/mes (el 15% que la IA no resolvió). Tiene tiempo real para mantenimiento preventivo, limpieza, atender al cliente que entra. |
| **Usuario** | Si el encargado está ocupado (atendiendo otra llamada, haciendo una ronda, arreglando algo), el telefonillo suena y suena. | La IA atiende al instante, siempre. Si escala al encargado y está ocupado, el sistema le notifica y le pasa el contexto — atiende en cuanto puede. |
| **Madrugada** | Si hay encargado nocturno: igual que de día, pero con menos incidencias. Si no hay: el telefonillo no lo atiende nadie. | La IA 24/7. Si escala de madrugada y no hay encargado → operador remoto de guardia (desde casa). Si es físico urgente → el sistema notifica al manager o al encargado localizable. |
| **Idiomas** | Contratar encargados que hablen inglés, alemán, francés... o perder clientes. | IA multilingüe automática. Si escala al encargado, el sistema ya tradujo y le pasa la incidencia en español. |

### Flujo real de escalado

```mermaid
flowchart TD
    INCIDENCIA[Incidencia del usuario<br/>Telefonillo o Kiosko]
    
    IA{¿IA puede resolver?}
    
    IA -->|85% Sí| RESUELTO[Resuelto automáticamente<br/>Abrir barrera, cobrar, informar]
    
    IA -->|15% No| TIPO{¿Qué tipo de escalado?}
    
    TIPO -->|Requiere presencia física<br/>o el encargado está en garita| ENCARGADO[Se deriva al encargado<br/>Llamada transferida<br/>o notificación en su panel<br/>con contexto completo]
    
    TIPO -->|Madrugada / sin encargado<br/>o incidencia puramente digital| REMOTO[Operador remoto de guardia<br/>Desde casa, multi-parking<br/>Cubre horas valle y noche]
    
    ENCARGADO --> RESUELVE_ENC[Encargado resuelve<br/>Físicamente o desde garita]
    REMOTO --> RESUELVE_REM[Operador resuelve<br/>Acciones remotas]
```

### Qué cambia y qué no — Parking con plantilla

```
❌ NO SE TOCA al encargado de caja/rondas.
   Misma gente, mismo sueldo. Solo deja de recibir llamadas.

✅ SE ELIMINA el puesto de operador de telefonillo.
   Era un puesto dedicado a contestar "¿por qué no abre?" 500 veces al mes.
   La IA lo absorbe. Ahorro real: ~1.830 €/mes por turno eliminado.

➕ SE AÑADE operador remoto nocturno (~250 €/mes compartido).
   Solo para madrugada/horas valle.
```

### Visión a futuro: parkings pequeños gestionados en remoto

> [!tip] Fase 2 — cuando el sistema esté probado al 100%
> Hoy el parking pequeño (1 persona por turno) no puede eliminar a su encargado porque alguien tiene que estar físicamente para incidencias, caja y presencia. Pero si el sistema demuestra **cero fallos en parkings grandes durante 6-12 meses**, se abre un modelo nuevo:

```
Parking pequeño con IA madura:

  3 parkings de 100 plazas en la misma zona
  ↓
  1 encargado rotativo entre los 3 (presencia física cuando haga falta)
  + IA resolviendo el 95%+ de incidencias
  + Operador remoto de guardia
  ↓
  Ahorro: 2 puestos de encargado eliminados (~3.660 €/mes)
  ↓
  De "no rentable" a "muy rentable"
```

> [!warning] Esto NO es para hoy
> Requiere que el sistema tenga una tasa de resolución >95% y cero falsos positivos en apertura de barreras. Es el horizonte al que se llega después de validar en parkings grandes con plantilla. Pero es el argumento de largo plazo para el manager que hoy tiene parkings pequeños: "cuando el sistema esté maduro, esto te permite gestionar 3 parkings con 1 persona."

### ¿Para qué parking es rentable?

No todos los parkings son iguales. El punto de equilibrio está en la plantilla:

```mermaid
flowchart LR
    subgraph PEQUE["🥜 Parking pequeño<br/><150 plazas<br/>1 persona por turno"]
        P1[1 encargado hace todo:<br/>telefonillo + caja + rondas]
    end

    subgraph MED["💰 Parking mediano<br/>150-400 plazas<br/>2-3 personas por turno"]
        P2[1 operador de telefonillo<br/>1 encargado en caja/rondas<br/>+ refuerzo en hora punta]
    end

    subgraph GRAN["🏬 Parking grande<br/>400+ plazas<br/>3-5 personas por turno"]
        P3[1-2 operadores de telefonillo<br/>1-2 en caja<br/>1 encargado de mantenimiento<br/>Múltiples salidas/plantas]
    end

    PEQUE --> NO[❌ NO rentable<br/>No hay puestos que eliminar<br/>Valor cualitativo solamente]
    MED --> SI[✅ SÍ rentable<br/>Eliminar 1 puesto de telefonillo<br/>Ahorro: ~1.500 €/mes netos]
    GRAN --> MUY[✅✅ MUY rentable<br/>Eliminar 2+ puestos<br/>Ahorro: ~3.000-4.500 €/mes netos]
```

> [!tip] Punto de equilibrio: 2 personas por turno
> Si el parking solo tiene 1 persona por turno, no hay puesto que eliminar — el encargado tiene que estar ahí físicamente sí o sí. El sistema aporta calidad pero no ahorro directo.
> A partir de **2 personas por turno**, ya hay un operador cuyo trabajo es mayoritariamente atender el telefonillo (70%+ del tiempo). Ese puesto **se puede eliminar o reasignar**. El sistema cuesta ~380 €/mes y libera ~1.830 €/mes en salario. **Ahorro neto: ~1.450 €/mes.**

### La matemática según tamaño de parking

| | Parking pequeño | Parking mediano | Parking grande |
|---|---|---|---|
| **Plazas** | <150 | 150-400 | 400-1.000+ |
| **Salidas** | 1-2 | 2-4 | 4+ |
| **Personas por turno** | 1 | 2-3 | 3-5 |
| **Puestos de telefonillo** | 0 (lo atiende el encargado) | 1 por turno | 1-2 por turno |
| **¿Se puede eliminar algún puesto?** | No | **Sí, 1 por turno** | **Sí, 1-2 por turno** |
| **Ahorro en salarios/mes** | 0 € | ~1.830 € | ~3.660-5.490 € |
| **Coste del sistema/mes** | ~380 € | ~380 € | ~500-700 € (más líneas IA) |
| **Ahorro neto/mes** | **-380 €** (cuesta) | **~1.450 €** ✅ | **~3.000-4.800 €** ✅✅ |
| **ROI** | No aplica (es inversión en calidad) | <8 días | <3 días |

### El parking de pruebas ideal

Para la primera implantación, el parking ideal tiene:
- **2+ personas por turno** → se puede demostrar ahorro real desde el día 1
- **Múltiples salidas** → más puntos de fricción, más incidencias, más valor del sistema
- **Tráfico mixto** (abonados + rotación) → variedad de incidencias para entrenar la IA
- **Afluencia turística** → el multilingüe se nota y se valora

Ejemplos: parking de centro comercial, parking de hospital, parking de estación de tren, parking de aeropuerto (mediano).

### La matemática real — Parking mediano típico

```
Parking de 300 plazas, centro comercial, 3 personas por turno:

ANTES:
  Operador telefonillo (1 por turno):  4.5 FTE × 1.830 €/mes = 8.235 €/mes
  Encargados caja/rondas (2 por turno): 9.0 FTE × 1.830 €/mes = 16.470 €/mes
  ─────────────────────────────────────────────────────────────
  TOTAL PERSONAL:                                          24.705 €/mes

DESPUÉS:
  Operador telefonillo:                0 FTE                            0 €/mes
  Encargados caja/rondas:              9.0 FTE × 1.830 €/mes = 16.470 €/mes
  (Los mismos. La IA les quita el telefonillo de encima.)
  Sistema Parkings IA:                                      ~   380 €/mes
  ─────────────────────────────────────────────────────────────
  TOTAL:                                                   16.850 €/mes

  AHORRO NETO MENSUAL: ~7.855 €/mes (32% de reducción)
  ROI DEL SISTEMA: <2 días
```

### Y si el parking es pequeño...

```
Parking de 100 plazas, 1 persona por turno:

ANTES:
  1 encargado por turno (24/7):       4.5 FTE × 1.830 €/mes = 8.235 €/mes

DESPUÉS:
  El mismo encargado.                   4.5 FTE × 1.830 €/mes = 8.235 €/mes
  Sistema Parkings IA:                                      ~   380 €/mes

  COSTE ADICIONAL: +380 €/mes

  ¿Vale la pena? Solo si el parking valora:
  - Atención multilingüe para turistas
  - Cero esperas en telefonillo (el encargado ya no deja de hacer rondas)
  - Trazabilidad de incidencias
  - Cobertura nocturna sin contratar a nadie extra
```

### Flujo multi-parking

```mermaid
flowchart TB
    subgraph PARKINGS["🏢 Parkings — cada uno con su encargado en garita"]
        subgraph P1BOX["Parking A"]
            P1[Parking A<br/>200 plazas]
            E1[Encargado A<br/>en garita]
        end
        subgraph P2BOX["Parking B"]
            P2[Parking B<br/>150 plazas]
            E2[Encargado B<br/>en garita]
        end
        subgraph P3BOX["Parking C"]
            P3[Parking C<br/>300 plazas]
            E3[Encargado C<br/>en garita]
        end
    end

    subgraph CAPA_IA["🤖 Capa IA — 85% de incidencias"]
        IA_CORE[IA conversacional<br/>Resuelve sin intervención humana<br/>Abrir barrera, validar ticket, cobrar]
    end

    subgraph CAPA_NOCTURNA["🌙 Cobertura nocturna — solo cuando no hay encargado"]
        REMOTO[Operador remoto<br/>1 persona para 3+ parkings<br/>Solo horas valle y madrugada]
    end

    subgraph MANAGER["📊 Manager"]
        DASH[Dashboard<br/>Incidencias por parking<br/>Tasa de automatización<br/>Horas pico]
    end

    P1 -->|Incidencias| IA_CORE
    P2 -->|Incidencias| IA_CORE
    P3 -->|Incidencias| IA_CORE
    IA_CORE -->|85% resuelto| P1
    IA_CORE -->|85% resuelto| P2
    IA_CORE -->|85% resuelto| P3
    IA_CORE -->|15% escala| E1
    IA_CORE -->|15% escala| E2
    IA_CORE -->|15% escala| E3
    IA_CORE -.->|Si no hay encargado<br/>noche / valle| REMOTO
    REMOTO -.->|Acciones remotas| P1
    REMOTO -.->|Acciones remotas| P2
    REMOTO -.->|Acciones remotas| P3
    IA_CORE -->|Métricas| DASH
```

### Política de degradación elegante

Cuando la IA no puede resolver Y no hay operador disponible (ej: 4am, operador durmiendo) Y el encargado no está en el parking:

| Tipo de incidencia | Acción automática |
|--------------------|-------------------|
| Barrera no abre, pago confirmado | **Abrir.** Registro completo. Notificación push al manager. |
| Barrera no abre, sin pago, tiempo < 15 min extra | **Abrir con cortesía.** Marcar matrícula. A la 3ª cortesía en el mes: bloquear. |
| Pestillo peatonal, acceso autorizado | **Abrir.** Si es zona restringida, verificar horario. |
| Ticket perdido, matrícula reconocida | **Cobrar tarifa máxima del día.** Marcar incidencia para revisión. |
| Barrera físicamente atascada (detectado por sensor) | **Notificar al encargado** con prioridad. Si no responde en 5 min: escalar a manager. Mientras tanto: mensaje al usuario con tiempo estimado. |
| Emergencia (accidente, incendio, atrapado) | **Protocolo automático:** abrir todas las barreras + llamar a emergencias (API) + notificar manager y encargado con prioridad crítica. |
| Matrícula no reconocida, sin datos | **No abrir.** Mensaje: "Su incidencia ha sido registrada. Será contactado a la mayor brevedad. Disculpe las molestias." |

---

## Flujo 3: Ciclo completo con todos los actores

```mermaid
flowchart TB
    subgraph USUARIO["👤 Usuario del parking"]
        U1[Incidencia detectada]
        U2[Elige canal según contexto]
    end

    subgraph CANALES["📱 Canales de entrada"]
        C1[Tablet / Kiosko táctil<br/>PWA responsive]
        C2[Telefonillo físico<br/>- VoIP - IA]
    end

    subgraph CORE["🧠 SOM-OS.dev Core"]
        IA[IA conversacional<br/>Clasificación + NLU + decisión]
        APP[App de gestión<br/>Dashboard + históricos]
        CONECTOR[Conector universal<br/>de parkings]
    end

    subgraph LORENÇ["📞 Capa Lorenç Prats"]
        VOIP[SIP Trunking<br/>+ numeración]
        TELEFONILLOS[Hardware telefonillos<br/>instalados en parking]
    end

    subgraph PARKING["🏢 Sistema del parking"]
        SGP[Sistema de gestión<br/>Scheidt / SKIDATA / ParkHelp / etc.]
        BARRERAS[Controladora<br/>de barreras]
        PESTILLOS[Pestillos electrónicos<br/>Puertas peatonales<br/>Accesos restringidos]
        CAMARAS[Lectores de<br/>matrícula]
    end

    subgraph DASHBOARD["📊 Dashboard manager"]
        METRICAS[Métricas en tiempo real<br/>Incidencias/hora<br/>Tasa de resolución IA<br/>Tiempo medio<br/>Comparativa multi-parking]
        ALERTAS[Alertas: picos,<br/>anomalías, operador necesario]
    end

    U1 --> U2
    U2 -->|De pie| C1
    U2 -->|En coche| C2
    C1 --> IA
    C2 --> VOIP --> IA
    IA <--> CONECTOR
    CONECTOR <--> SGP
    SGP <--> BARRERAS
    SGP <--> PESTILLOS
    SGP <--> CAMARAS
    IA --> APP
    APP --> METRICAS
    APP --> ALERTAS
    IA -.->|15% escala| ENCARGADO[🔧 Encargado en garita<br/>Primer humano en la cadena<br/>Recibe llamada o notificación]
    ENCARGADO -.->|Si no disponible<br/>noche/valle| REMOTO[👩‍💼 Operador remoto<br/>Backup nocturno<br/>Acciones remotas]
    REMOTO -.->|Acciones remotas| CONECTOR
    ENCARGADO -.->|Acciones físicas| BARRERAS
    ENCARGADO -.->|Acciones físicas| PESTILLOS
    
    VOIP -.-> TELEFONILLOS
```

---

## Arquitectura técnica

```mermaid
flowchart LR
    subgraph FRONTEND["🎨 Frontend"]
        KIOSKO_WEB[Tablet/Kiosko<br/>PWA Nuxt 4<br/>Multilenguaje]
    end

    subgraph BACKEND["⚙️ Backend NestJS"]
        API_GW[API Gateway]
        IA_SVC[IA Service<br/>NLU + Clasificación + Decisión]
        CONNECTOR[Connector Service<br/>Capa de abstracción de parkings]
        INCIDENCIAS[Incident Service<br/>CRUD + workflow + auditoría]
        DASHBOARD[Dashboard Service<br/>Métricas + alertas]
        ESCALADO[Escalation Service<br/>Ruteo inteligente<br/>Cola multi-parking]
    end

    subgraph TELEFONIA["📞 Telefonía"]
        SIP[SIP Trunk<br/>Lorenç Prats]
        MEDIA[Media Server<br/>Audio streaming]
        STT_SVC[STT Engine<br/>Whisper / Deepgram]
        TTS_SVC[TTS Engine<br/>ElevenLabs / Azure]
    end

    subgraph EXTERNO["🏢 Parking + Operador"]
        SGP1[Adapter: Scheidt & Bachmann]
        SGP2[Adapter: SKIDATA]
        SGP3[Adapter: ParkHelp]
        SGP4[Adapter: Genérico/API REST]
        HW[Hardware<br/>Barreras + Pestillos + Cámaras]
        CONSOLA_OP[Consola operador remoto<br/>Vista multi-parking<br/>Acciones remotas]
    end

    subgraph DATA["💾 Datos"]
        PG[(PostgreSQL<br/>Incidencias + métricas)]
        REDIS[(Redis<br/>Estado de sesiones IA<br/>+ caché de matrículas)]
        VEC[(Vector Store<br/>Base de conocimiento<br/>para IA)]
    end

    KIOSKO_WEB --> API_GW
    SIP --> MEDIA --> STT_SVC
    STT_SVC --> IA_SVC
    IA_SVC --> TTS_SVC --> MEDIA
    API_GW --> IA_SVC
    API_GW --> INCIDENCIAS
    API_GW --> DASHBOARD
    API_GW --> ESCALADO
    IA_SVC --> CONNECTOR
    IA_SVC -.->|No resoluble| ESCALADO
    ESCALADO --> CONSOLA_OP
    CONSOLA_OP -.->|Acciones remotas| CONNECTOR
    CONNECTOR --> SGP1
    CONNECTOR --> SGP2
    CONNECTOR --> SGP3
    CONNECTOR --> SGP4
    SGP1 --> HW
    SGP2 --> HW
    SGP3 --> HW
    SGP4 --> HW
    IA_SVC --> VEC
    INCIDENCIAS --> PG
    DASHBOARD --> PG
    ESCALADO --> PG
    IA_SVC --> REDIS
```

---

## El conector universal: el corazón del proyecto

### Interfaz abstracta del conector

```typescript
interface ParkingConnector {
  // Identificación
  buscarPorMatricula(matricula: string): Promise<VehiculoInfo | null>;
  buscarPorTicket(codigoTicket: string): Promise<VehiculoInfo | null>;

  // Barreras (vehículos)
  abrirBarrera(carrilId: string, motivo: string): Promise<Resultado>;
  estadoBarrera(carrilId: string): Promise<EstadoBarrera>;

  // Pestillos y puertas peatonales
  abrirPestillo(puertaId: string, motivo: string): Promise<Resultado>;
  estadoPestillo(puertaId: string): Promise<EstadoPestillo>;
  bloquearPuerta(puertaId: string, duracionMinutos?: number): Promise<Resultado>;

  // Tarifas y pagos
  calcularTarifa(vehiculoId: string): Promise<Tarifa>;
  validarPago(vehiculoId: string, metodo: MetodoPago): Promise<Resultado>;

  // Incidencias
  registrarIncidencia(vehiculoId: string, incidencia: Incidencia): Promise<Ticket>;

  // Estado
  estadoParking(): Promise<EstadoParking>;
}

interface EstadoPestillo {
  puertaId: string;
  abierto: boolean;
  bloqueado: boolean;
  ultimaApertura: Date;
  tipo: 'peatonal' | 'empleados' | 'restringido' | 'emergencia';
}
```

### Estrategia de implementación

| Fase | Qué | Resultado |
|------|-----|-----------|
| **Fase 1** | Adapter concreto para el parking de pruebas | Sistema funcionando en un parking real |
| **Fase 2** | Extraer interfaz común + adapter genérico HTTP | Conector reutilizable para parkings con API REST |
| **Fase 3** | Adapters específicos por fabricante | Cobertura del 80% del mercado |
| **Fase 4** | SDK público para que fabricantes implementen | Efecto red: SOM-OS.dev como estándar |

---

## Mapa de decisiones de la IA

```mermaid
flowchart TD
    INPUT[Incidencia del usuario<br/>Texto o transcripción de voz]
    
    CLASIFICAR[Clasificar intención]
    
    BARRERA{intent =<br/>barrera_no_abre?}
    PAGO{intent =<br/>problema_pago?}
    TICKET_INTENT{intent =<br/>ticket_problema?}
    MATRICULA_PROB{intent =<br/>matricula_no_reconocida?}
    OTRO_INTENT{intent = otro}
    
    CHECK_DATA{¿Datos del vehículo<br/>disponibles?}
    CHECK_PAGO{¿Pago realizado?}
    CHECK_TIEMPO{¿Tiempo < límite<br/>de cortesía?}
    CHECK_TICKET{¿Ticket válido?}
    CHECK_ABONO{¿Tiene abono activo?}
    
    ABRIR_YA[Abrir barrera<br/>Registrar motivo]
    COBRAR[Aplicar tarifa<br/>Ofrecer métodos de pago]
    REIMPRIMIR[Reimprimir ticket<br/>o usar matrícula]
    ESCALAR[Escalar a operador<br/>+ contexto completo]
    EMERGENCIA[Protocolo emergencia<br/>Notificar manager]
    
    INPUT --> CLASIFICAR
    CLASIFICAR --> BARRERA
    CLASIFICAR --> PAGO
    CLASIFICAR --> TICKET_INTENT
    CLASIFICAR --> MATRICULA_PROB
    CLASIFICAR --> OTRO_INTENT
    
    BARRERA -->|Sí| CHECK_DATA
    CHECK_DATA -->|Sí| CHECK_PAGO
    CHECK_PAGO -->|Sí| ABRIR_YA
    CHECK_PAGO -->|No| CHECK_TIEMPO
    CHECK_TIEMPO -->|Sí - cortesía| ABRIR_YA
    CHECK_TIEMPO -->|No| COBRAR
    CHECK_DATA -->|No - pedir matrícula| ESCALAR
    
    PAGO -->|Sí| COBRAR
    
    TICKET_INTENT -->|Sí| CHECK_TICKET
    CHECK_TICKET -->|Sí| ABRIR_YA
    CHECK_TICKET -->|No| REIMPRIMIR
    
    MATRICULA_PROB -->|Sí| CHECK_ABONO
    CHECK_ABONO -->|Sí| ABRIR_YA
    CHECK_ABONO -->|No - pedir datos manuales| ESCALAR
    
    OTRO_INTENT --> ESCALAR
```

---

## Dashboard del manager de parking

```mermaid
flowchart LR
    subgraph METRICAS["📊 KPIs en tiempo real"]
        M1[Incidencias hoy<br/>Resueltas por IA vs humanas]
        M2[Tasa de resolución<br/>Objetivo: >85% automatizado]
        M3[Tiempo medio<br/>de resolución]
        M4[Idiomas detectados<br/>Top 5]
    end

    subgraph ALERTAS["🚨 Alertas configurables"]
        A1["Pico de incidencias<br/>+10 en 5 min: posible fallo"]
        A2[Barrera no responde<br/>Timeout de conexión]
        A3[IA derivando >30%<br/>Revisar base de conocimiento]
    end

    subgraph HISTORICO["📜 Histórico"]
        H1[Incidencias por día/hora<br/>Patrón: hora punta 18-20h]
        H2[Tipos de incidencia<br/>más comunes]
        H3[Matrículas con<br/>incidencias recurrentes]
    end

    subgraph CONFIG["⚙️ Configuración"]
        CFG1[Reglas de negocio<br/>Tiempo de cortesía<br/>Tarifas especiales]
        CFG2[Base de conocimiento<br/>Respuestas frecuentes<br/>en todos los idiomas]
        CFG3[Roles y permisos<br/>Operadores, managers]
    end
```

---

## Stack técnico propuesto

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend kiosko** | Nuxt 4 (PWA) + Tailwind | Misma base que [[06 - Proyectos/Foundation|Foundation]]. PWA para funcionar offline si hay microcortes. Teclado táctil optimizado. |
| **Consola operador** | Nuxt 4 + WebSocket | Vista multi-parking con actualización en tiempo real. Panel dividido: cola, contexto, controles. |
| **Backend** | NestJS 11 | Tipado, modularidad, guards para roles. Foundation ya tiene esta base. |
| **IA conversacional** | DeepSeek / GPT-4o-mini (clasificación barata) + RAG con vector store | Clasificación de intención con modelo pequeño y barato. RAG para respuestas contextuales del parking concreto. |
| **STT (voz a texto)** | Whisper (Open Source) o Deepgram | Multilenguaje automático. Sin depender de un solo proveedor. |
| **TTS (texto a voz)** | ElevenLabs o Azure Speech | Voz natural multilingüe. Baja latencia (<500ms) para conversación fluida. |
| **Telefonía** | SIP trunking (Lorenç) + Asterisk/FreeSWITCH | Media server para bridging entre llamada telefónica y stream de audio hacia el STT/TTS. |
| **Conector parkings** | Patrón Adapter por fabricante | Cada parking implementa su adapter. Interfaz común en TypeScript. |
| **Base de datos** | PostgreSQL + Redis | Foundation ya usa este stack. Redis para estado de sesiones IA y caché. |
| **Vector store** | Qdrant o pgvector | Base de conocimiento del parking: FAQs, reglas, horarios, tarifas. |

---

## Estimación de costes mensuales

> [!info] Coste medio estimado por parking: **100-160 €/mes**
> Esto incluye servidor, IA, telefonía y licencia del sistema. No incluye el desarrollo inicial ni el hardware físico (tablets, telefonillos), que van por Lorenç y el manager del parking.

### Desglose por parking (150 plazas, ~500 incidencias/mes)

| Concepto | Proveedor | Coste unitario | Uso estimado/mes | Coste/mes |
|----------|-----------|---------------|-------------------|-----------|
| **Servidor VPS** (4 vCPU, 8GB) | Hetzner / Contabo | 40-60 €/mes fijo | Compartido entre 5 parkings | **8-12 €** |
| **PostgreSQL** | incluido en VPS o Neon free tier | 0 € | — | **0 €** |
| **Redis** | incluido en VPS | 0 € | — | **0 €** |
| **STT (voz a texto)** | Deepgram Nova-2 o Whisper | 0,004-0,006 €/min | ~200 llamadas × 1.5 min = 300 min | **1,20-1,80 €** |
| **TTS (texto a voz)** | ElevenLabs Turbo o Azure | 0,01-0,015 €/min | ~300 min (respuestas IA) | **3-4,50 €** |
| **LLM clasificación** | DeepSeek V4 Flash o GPT-4o-mini | ~0,002 €/call | ~500 incidencias | **1 €** |
| **LLM conversacional** | DeepSeek V4 o GPT-4o | ~0,08-0,15 €/min | ~100 min (casos complejos) | **8-15 €** |
| **SIP trunking** | Proveedor VoIP (Lorenç) | 5-10 €/mes + 0,01 €/min | 1 número + ~300 min llamadas | **8-13 €** |
| **Vector store (Qdrant)** | incluido en VPS | 0 € | — | **0 €** |
| **Licencia SOM-OS.dev** | Software + mantenimiento | 50-80 €/mes | Por parking | **50-80 €** |
| **TOTAL** | | | | **79-127 €/mes** |

> [!tip] ¿Por qué tan barato el LLM?
> El 85% de incidencias se resuelven con **clasificación de intención** (modelo pequeño, ~0,002 €/call). Solo el 15% que escala a operador o requiere diálogo complejo consume LLM conversacional (~0,11 €/min). Es clave diseñar el árbol de decisión para que el modelo caro se use lo mínimo.

### Comparativa: coste mensual

| | Actual | Con Parkings IA |
|---|---|---|
| **Encargados en garita** (turnos 24/7) | 4,5 FTE × 1.830 € = **8.235 €/mes** | 4,5 FTE × 1.830 € = **8.235 €/mes** |
| **Operador remoto nocturno** | — | ~**250 €/mes** (compartido entre parkings) |
| **Sistema Parkings IA** | — | **100-160 €/mes** |
| **Total operación** | **8.235 €/mes** | **8.585-8.645 €/mes** |
| **Coste adicional** | — | **~380 €/mes (+4.6%)** |

> [!note] El encargado no se toca
> El sistema no ahorra en salarios porque el encargado **no se puede eliminar** — tiene que estar físicamente en la garita. El valor real es calidad de servicio: sin esperas, multilingüe, trazabilidad, cobertura nocturna real, y el encargado liberado para hacer mantenimiento preventivo en vez de contestar 500 llamadas al mes.

### Escalado: del parking 1 al parking 10

```
Parking 1:  130 €/mes (servidor VPS se amortiza solo)
Parking 2:  120 €/mes (comparte VPS, mismo operador)
Parking 3:  115 €/mes (economías de escala en IA, Redis compartido)
Parking 4:  110 €/mes
Parking 5:  105 €/mes (VPS se paga completamente entre los 5)
...
Parking 10: ~95 €/mes (coste marginal tiende a licencia + consumo IA)
```

> [!note] Hardware físico NO incluido
> Tablets para kioskos (~150-300 €/unidad, amortizable), telefonillos SIP (~80-200 €/unidad) y pestillos electrónicos van por cuenta del parking o de Lorenç. SON-OS.dev solo provee el software, la IA y el conector.

### Lo que el sistema aporta (más allá del coste)

| Problema actual | Con Parkings IA |
|-----------------|-----------------|
| Usuario esperando al telefonillo porque el encargado está ocupado | IA atiende al instante, siempre. 0 espera. |
| Turista alemán que nadie entiende → se va furioso | IA multilingüe automática. El encargado recibe la incidencia traducida. |
| Encargado no puede hacer mantenimiento porque el telefonillo no para | 85% menos interrupciones. Tiempo real para prevenir averías. |
| De madrugada no hay quien atienda → coches atrapados | IA + operador remoto de guardia. Cobertura 24/7 real. |
| "¿Quién abrió la barrera a las 3am?" → nadie sabe | Trazabilidad total: cada acción queda registrada con motivo. |
| Mismo problema recurrente (ej: lector de matrícula sucio) → nadie se entera del patrón | Dashboard detecta patrones y alerta antes de que sea un problema crónico. |

---

## Consideraciones críticas

> [!warning] Desafíos técnicos

| # | Desafío | Riesgo | Mitigación |
|---|---------|--------|------------|
| 1 | **Fragmentación de sistemas de parking** | Cada fabricante tiene su propio protocolo. Algunos sin API documentada. | Empezar con el parking de pruebas (protocolo conocido). Abstraer después. |
| 2 | **Latencia en llamada IA** | STT → NLU → Decisión → TTS. Si tarda >2s, la conversación se siente robotizada. | Usar STT/TTS streaming. Precalentar modelos. Redis para estado de sesión. |
| 3 | **Ruido ambiente en el parking** | El telefonillo capta tráfico, viento, otros coches. El STT falla. | Microfonía direccional. Noise suppression DSP en el media server. |
| 4 | **Fallback cuando IA no resuelve** | Si la IA deriva al operador pero no hay operador disponible de madrugada. | Definir política de "degradación elegante": abrir barrera si es seguro + notificar al manager. |
| 5 | **Seguridad de apertura de barreras** | Un fallo o un prompt injection podría abrir barreras indebidamente. | La IA nunca abre barreras directamente. El conector tiene una capa de validación independiente (reglas hardcodeadas, no LLM). |
| 6 | **Concurrencia: 3 llamadas a la vez** | ¿Cuántas líneas IA simultáneas soporta el sistema? | Dimensionar media server + procesos STT paralelos. Escalar horizontalmente con más instancias. |
| 7 | **Mantenimiento del conector** | Cada actualización del software del fabricante puede romper la integración. | Contratos con managers: acceso a entornos de staging. Tests de integración automatizados. |
| 8 | **Pestillos electrónicos sin estándar** | Cada fabricante de cerraduras eléctricas (ASSA ABLOY, dormakaba, Salto) tiene su protocolo. Algunos son relays secos, otros modbus, otros API propietaria. | El conector abstrae la capa física. Para el parking de pruebas: relevar modelo exacto y construir adapter. A futuro: catálogo de pestillos compatibles. |
| 9 | **Operador remoto: desorientación** | El operador recibe una incidencia del Parking C pero no conoce físicamente ese parking. ¿Dónde está la puerta 3? ¿Qué cámara la ve? | Cada puerta/barrera tiene foto + posición en plano en la consola. El operador ve la vista de cámara correspondiente automáticamente al seleccionar el dispositivo. |
| 10 | **Operador remoto: latencia en acciones** | El operador está en su casa con conexión doméstica. Un comando `abrirBarrera` que tarda 3s es una eternidad para el usuario en el coche. | WebSocket con keep-alive. Acciones críticas con confirmación local inmediata (optimistic UI) y verificación backend asíncrona. Timeout máximo: 500ms. |
| 11 | **Horas valle: ¿quién paga al operador?** | Si el operador es compartido entre 5 parkings pero solo hay 2 incidencias en toda la noche, el coste por incidencia es altísimo. | Modelo híbrido: operador de guardia con sueldo base bajo + bono por incidencia resuelta. O IA + degradación elegante para horas valle. |

---

## Fases sugeridas

### Fase 0 — Descubrimiento (2 semanas)
- [ ] Visita al parking de pruebas con Lorenç
- [ ] Relevar sistema de gestión que usan (fabricante, versión, API disponible)
- [ ] Relevar hardware: telefonillos, barreras, cámaras LPR, **pestillos electrónicos, puertas peatonales**
- [ ] Identificar marcas/modelos de pestillos, verificar si tienen API/relay
- [ ] Definir top 10 incidencias más comunes (datos reales del parking)
- [ ] Relevar reglas de negocio: tarifas, cortesías, abonos, excepciones, zonas restringidas
- [ ] Probar latencia y ruido en el telefonillo real

### Fase 1 — Conector + IA básica (4-6 semanas)
- [ ] Adapter concreto para el sistema del parking de pruebas
- [ ] Endpoints: `buscarPorMatricula`, `abrirBarrera`, `abrirPestillo`, `calcularTarifa`, `registrarIncidencia`
- [ ] IA conversacional con clasificación de intenciones (modo texto, sin voz aún)
- [ ] Dashboard interno de incidencias (solo para nosotros)
- [ ] Prueba controlada: simular las 10 incidencias top

### Fase 2 — Voz + Kiosko (4 semanas)
- [ ] Integración SIP trunking de Lorenç con media server
- [ ] Pipeline STT → IA → TTS completo
- [ ] PWA para kiosko táctil (multilenguaje)
- [ ] Prueba con usuarios reales en el parking

### Fase 3 — Dashboard manager + Consola operador + refactor conector (3-4 semanas)
- [ ] Dashboard para el manager del parking (métricas, alertas, histórico)
- [ ] **Consola del operador remoto multi-parking** (cola unificada, contexto, acciones remotas)
- [ ] Sistema de ruteo inteligente y política de degradación elegante
- [ ] Extraer interfaz abstracta del conector
- [ ] Documentar protocolo de integración para nuevos fabricantes y pestillos

### Fase 4 — Expansión horizontal (continuo)
- [ ] Nuevos adapters por fabricante
- [ ] Onboarding de parkings de la red de Lorenç
- [ ] SDK público (largo plazo)

---
## Relaciones

- [[08 - Clientes/Lorenç Prats - Telecomunicaciones y Parkings IA]] — ficha de cliente, contexto de negocio
- [[06 - Proyectos/Foundation]] — base técnica del monorepo
- [[Conceptos/Concepto Central Actualizado - De componentes aislados a sistemas operativos inteligentes]] — esto es un sistema operativo de parking
- [[Conceptos/Propuesta de Valor - Sistemas operativos empresariales]] — propuesta de valor aplicada
- [[Conceptos/ADN - Tecnología-Tierra]] — IA + VoIP aterrizadas en un parking físico
- [[Conceptos/Metodología - 5 pasos SOM-OS]] — metodología para el conector universal
- [[Conceptos/Diferenciación - Inventor vs Técnico]] — no es instalar un chatbot, es integrar hardware, voz y gestión