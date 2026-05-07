---
title: "Valor Balear — Arquitectura de Pagos"
date: 2026-05-07
tags:
  - proyecto
  - valor-balear
  - pagos
  - arquitectura
  - decision
  - stripe-connect
  - mollie
  - paynopain
  - marketplace
  - multi-vendor
description: "Decisión de arquitectura de pagos para Valor Balear. Análisis comparativo de Stripe Connect, Mollie y PaynoPain como soluciones de split payment multi-vendor para el marketplace de productos baleares."
---

# Valor Balear — Arquitectura de Pagos

> [!info] Resumen
> Decisión de arquitectura de pagos para el marketplace [[Valor Balear]]. Se analizan tres soluciones de split payment multi-vendor (Stripe Connect, Mollie for Marketplaces, PaynoPain) y se define la estrategia de implementación usando adapter pattern para evitar vendor lock-in.

---

## Contexto

[[Valor Balear]] es un marketplace multi-vendor de productos baleares. Su modelo de monetización es **comisión por venta** con split automático: el cliente paga una vez y el pago se reparte entre la plataforma (X% comisión) y cada artesano.

### Requisitos del sistema de pagos

| Requisito | Crítico | Descripción |
|-----------|---------|-------------|
| **Split payments** | ✅ | 1 pago del cliente → reparto automático entre N artesanos + plataforma + (futuro) afiliado |
| **KYC de vendedores** | ✅ | Onboarding con verificación de identidad para cada artesano |
| **Payouts automáticos** | ✅ | El dinero llega directo al artesano sin intermediación manual |
| **Cuenta bancaria española** | ✅ | Los artesanos son locales, necesitan recibir en bancos españoles |
| **Bizum** | ⚠️ Deseable | Método de pago dominante en España; puede reducir abandono de checkout |
| **API documentada** | ✅ | Integración con NestJS (backend [[Foundation]]) |
| **Cumplimiento PSD2** | ✅ | Normativa europea de pagos |
| **Soporte en español** | ⚠️ Deseable | Los artesanos pueden necesitar ayuda con incidencias de payout |

---

## Alternativas evaluadas

### Categorías de soluciones de pago

Para un marketplace, NO sirven las soluciones SaaS tradicionales. Se necesita una plataforma de **split payment multi-vendor**:

| Tipo | Ejemplos | ¿Sirve para marketplace? |
|------|----------|--------------------------|
| **MoR (Merchant of Record)** | Paddle, Lemon Squeezy, FastSpring | ❌ Solo para SaaS/digital propio. No tienen split multi-vendor. |
| **Pasarela de pago tradicional** | Redsys, Braintree (sin PayPal Commerce) | ❌ No tienen split nativo. Requiere construir lógica de reparto manual. |
| **Plataforma de split payment** | Stripe Connect, Mollie for Marketplaces, PaynoPain Marketplace, Mangopay, Adyen for Platforms | ✅ Diseñadas específicamente para marketplaces. |

### ¿Por qué NO los MoR (Paddle, Lemon Squeezy)?

Los Merchants of Record actúan como vendedor legal. Eso significa:

- Facturan ellos al cliente final
- Gestionan IVA/VAT global
- Cobran ~5% + 0.50€

Pero **NO pueden hacer split entre 20 artesanos distintos**. Están diseñados para que UNA entidad venda SU propio producto digital. En Valor Balear, cada artesano es un vendedor independiente que necesita recibir su parte directamente.

---

## Comparativa detallada

### Tabla comparativa

| | Stripe Connect | Mollie Marketplace | PaynoPain Marketplace |
|---|---|---|---|
| **Split payments** | ✅ Nativo (Payment Intents + transfers) | ✅ Nativo (split automático con fee deduction) | ✅ Nativo (payment splits personalizables) |
| **KYC sellers** | ✅ Stripe Onboarding (Connect) | ✅ Co-branded onboarding flow | ✅ KYC integrado |
| **Payouts** | ✅ Automáticos, programables | ✅ Payouts programables, rolling payouts | ✅ Pay-in/Pay-out en tiempo real |
| **Escrow (PSD2)** | ❌ No tiene | ❌ No tiene | ✅ Cuentas escrow nativas |
| **Bizum** | ❌ No soportado | ⚠️ "Acquirer fees + 0.10% + 0.10€" (opaco) | ✅ 1.20% + 0.15€ |
| **Comisión EEA consumer** | 1.40% + 0.25€ | 1.80% + 0.25€ | **0.60% + 0.15€** |
| **Comisión EEA business** | 2.50% + 0.25€ | 2.90% + 0.25€ | 1.80% + 0.15€ |
| **Comisión internacional** | 2.90% + 0.25€ | 3.25% + 0.25€ | 2.80% + 0.15€ |
| **Métodos de pago** | ~20 | 35+ | 50+ |
| **Crypto** | ❌ (solo USDC) | ❌ | ✅ |
| **API calidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Integración Foundation** | ✅ Ya existe (`stripeCustomerId`) | ❌ Desde cero | ❌ Desde cero |
| **Soporte español** | ❌ Inglés | ⚠️ Limitado (sede Países Bajos) | ✅ Nativo (sede Castellón) |
| **Sede** | Irlanda (UE) + US | Países Bajos (UE) | España (UE) |

### Simulación de costes: ticket medio de 40€

| Plataforma     | Comisión por venta        | Sobre 100 ventas/mes | Sobre 1000 ventas/mes |
| -------------- | ------------------------- | -------------------- | --------------------- |
| Stripe Connect | 1.40% + 0.25€ = **0.81€** | 81€                  | 810€                  |
| Mollie         | 1.80% + 0.25€ = **0.97€** | 97€                  | 970€                  |
| PaynoPain      | 0.60% + 0.15€ = **0.39€** | 39€                  | 390€                  |

> [!tip] A 1000 ventas/mes, PaynoPain ahorra ~420€/mes vs Stripe. Eso son ~5.000€/año que se quedan en el ecosistema (más margen para la plataforma o menos comisión al artesano).

---

## Análisis por opción

### Stripe Connect

**Fortalezas:**
- La API mejor documentada del mercado
- Integración preexistente en [[Foundation]] (`UserEntity.stripeCustomerId`, módulo `billing/stripe/`)
- Ecosistema masivo de librerías, ejemplos, y comunidad
- Onboarding de vendedores maduro (Stripe Connect Onboarding)
- Payouts a cuentas bancarias españolas funcionando hace años

**Debilidades:**
- **No tiene Bizum**. Para un marketplace de productos baleares donde el ticket medio es bajo (20-60€) y el público es español, esto puede penalizar la conversión
- Comisiones más altas que PaynoPain para tarjetas europeas
- Soporte solo en inglés (problema para artesanos no tecnológicos)
- No tiene cuentas escrow (el split es inmediato, el riesgo de chargeback recae en la plataforma)

### Mollie for Marketplaces

**Fortalezas:**
- Producto específico para marketplaces con split payments, payouts y onboarding
- 35+ métodos de pago europeos (iDEAL, Bancontact, Klarna, etc.)
- Onboarding co-branded con +60% adopción en SMBs europeos
- Mirakl partner (software de gestión de marketplace)
- Payouts en 15 divisas

**Debilidades:**
- **Bizum con pricing opaco**: "acquirer fees + 0.10% + 0.10€". Las comisiones de adquirencia en España son ~0.30-0.50%, lo que dejaría Bizum en ~0.40-0.60% + 0.10€. Pero al no ser transparente, no se puede calcular con certeza.
- Comisión base más alta que Stripe (1.80% vs 1.40%)
- Sede en Países Bajos — soporte en español limitado
- Menos adopción en el mercado español que PaynoPain
- Sin integración previa en Foundation

### PaynoPain Marketplace

**Fortalezas:**
- **Empresa española** (Castellón) — soporte cercano en español, conocimiento del mercado local
- **Bizum nativo y transparente**: 1.20% + 0.15€
- **Comisiones más bajas**: 0.60% + 0.15€ en consumer EEA (la mitad que Stripe)
- **Cuentas escrow nativas**: cumplimiento PSD2, protección de fondos, menor riesgo de chargeback
- +50 métodos de pago
- API REST documentada (`docs.paylands.com`)
- Certificaciones PCI DSS e ISO 27001
- Clientes relevantes: Meliá, CoverManager, Iberostar (sector turístico — afín a Baleares)

**Debilidades:**
- Menor presencia internacional (menos documentación comunitaria, menos ejemplos)
- API menos madura que Stripe (calidad ⭐⭐⭐ vs ⭐⭐⭐⭐⭐)
- Sin integración previa en Foundation
- Menos métodos de pago internacionales (no tan relevante para MVP España)

---

## Decisión

### Estrategia: Stripe Connect para MVP, PaynoPain como target post-MVP

> [!important] Decisión de arquitectura
> **Fase 1 (MVP): Stripe Connect** — por velocidad de implementación y sinergia con [[Foundation]].
> **Fase 2 (post-MVP): Evaluar migración a PaynoPain** — cuando haya datos reales de conversión, abandono de checkout y costes.

**Justificación:**

1. **Foundation ya tiene Stripe integrado**. Cambiar a otra plataforma en Fase 1 añade complejidad innecesaria cuando el foco debe estar en validar el modelo de negocio.

2. **La ausencia de Bizum es un riesgo conocido**, pero aceptable para el MVP. Los early adopters de un marketplace de nicho suelen estar dispuestos a pagar con tarjeta.

3. **La decisión no es binaria ni permanente**. Implementando un adapter pattern desde el día 1, la migración futura es cambiar una clase, no reescribir el módulo de pagos.

4. **PaynoPain es el candidato natural para España**: comisiones más bajas, Bizum nativo, soporte en español, cuentas escrow, y presencia en el sector turístico (Baleares).

5. **Mollie se descarta** para este caso: no ofrece ventajas significativas sobre PaynoPain en el mercado español, tiene comisiones más altas, y su pricing de Bizum es opaco.

---

## Estrategia de implementación: Adapter Pattern

Para evitar vendor lock-in y permitir migración futura sin fricción, el módulo de pagos se implementa con una interfaz abstracta:

```typescript
// payment-gateway.interface.ts
interface IPaymentGateway {
  createCheckoutSession(order: Order): Promise<CheckoutSession>;
  handleWebhook(payload: any): Promise<void>;
  createConnectedAccount(vendor: Vendor): Promise<string>;
  splitPayment(paymentId: string, splits: Split[]): Promise<void>;
  payout(vendorId: string, amount: number): Promise<PayoutResult>;
}

// stripe-connect.adapter.ts — Fase 1
class StripeConnectAdapter implements IPaymentGateway { ... }

// paynopain.adapter.ts — Preparado para Fase 2
class PaynoPainAdapter implements IPaymentGateway { ... }
```

> [!tip] Regla de oro
> El resto del código (Orders, SubOrders, Checkout, Webhooks) **nunca** debe importar `Stripe` directamente. Siempre a través de `IPaymentGateway`. Esto garantiza que cambiar de proveedor sea una decisión de negocio, no un proyecto de refactorización.

---

## Próximos pasos

- [ ] Implementar `IPaymentGateway` en Foundation
- [ ] Implementar `StripeConnectAdapter` para MVP
- [ ] Deploy MVP y medir tasa de conversión en checkout
- [ ] Medir % de usuarios que piden Bizum / abandonan por no tenerlo
- [ ] Evaluar migración a PaynoPain con datos reales (costo, conversión, feedback de artesanos)
- [ ] Implementar `PaynoPainAdapter` si los datos respaldan la migración

---

## Relaciones

- [[Valor Balear]] — proyecto principal
- [[Foundation]] — infraestructura base (monorepo NestJS + Nuxt)
- [[Atenfy]] — atención al cliente automatizada (consultas de pago)
- [[Conceptos/Propuesta de Valor - Sistemas operativos empresariales]] — filosofía del ecosistema
