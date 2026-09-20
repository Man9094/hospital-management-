---
name: Warm Clinical Enterprise
colors:
  surface: '#fef8f7'
  surface-dim: '#ded9d8'
  surface-bright: '#fef8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2f2'
  surface-container: '#f2edec'
  surface-container-high: '#ede7e6'
  surface-container-highest: '#e7e1e1'
  on-surface: '#1d1b1b'
  on-surface-variant: '#514346'
  inverse-surface: '#323030'
  inverse-on-surface: '#f5efef'
  outline: '#837376'
  outline-variant: '#d5c2c5'
  surface-tint: '#844f5c'
  primary: '#310a17'
  on-primary: '#ffffff'
  primary-container: '#4a1f2b'
  on-primary-container: '#c08491'
  inverse-primary: '#f7b5c3'
  secondary: '#83505b'
  on-secondary: '#ffffff'
  secondary-container: '#ffbeca'
  on-secondary-container: '#7b4955'
  tertiary: '#1c1527'
  on-tertiary: '#ffffff'
  tertiary-container: '#32293d'
  on-tertiary-container: '#9b90a8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e0'
  primary-fixed-dim: '#f7b5c3'
  on-primary-fixed: '#350e1a'
  on-primary-fixed-variant: '#683845'
  secondary-fixed: '#ffd9df'
  secondary-fixed-dim: '#f6b5c2'
  on-secondary-fixed: '#340f19'
  on-secondary-fixed-variant: '#673944'
  tertiary-fixed: '#ebddf8'
  tertiary-fixed-dim: '#cfc2db'
  on-tertiary-fixed: '#20182b'
  on-tertiary-fixed-variant: '#4c4358'
  background: '#fef8f7'
  on-background: '#1d1b1b'
  surface-variant: '#e7e1e1'
typography:
  display:
    fontFamily: Source Sans 3
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Source Sans 3
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Source Sans 3
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Source Sans 3
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-md:
    fontFamily: Source Sans 3
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Source Sans 3
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0em
  label-md:
    fontFamily: Source Sans 3
    fontSize: 0.8125rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Source Sans 3
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.025em
  caption:
    fontFamily: Source Sans 3
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.375rem
  space-md: 0.625rem
  space-lg: 1rem
  space-xl: 1.5rem
---

# Warm Clinical Enterprise Design System

## Brand & Style

This design system establishes an operational aesthetic defined as Warm Clinical Enterprise. Tailored for healthcare environments operating continuously across demanding 12-hour shifts—including Outpatient Departments (OPD), Inpatient Wards, Nursing Stations, Diagnostic Laboratories, and Billing—it rejects the sterile, cold blues and stark hospital whites that cause visual fatigue. 

Instead, the identity balances institutional precision with grounding warmth. Natural limestone undertones, deep heritage wine tones, and muted earth-mineral accents create an atmosphere that feels authoritative, composed, and human. The interface avoids frivolous ornamentation, neon glows, glossy glassmorphism, or synthetic gradients. Visual order is sustained through disciplined information density, hairline compartmentalization, high typographic legibility, and quiet spatial hierarchy. The overarching mood conveys clinical reliability, unhurried precision, and institutional prestige.

## Colors

The palette is engineered to eliminate glare and eye strain under hospital fluorescent lighting while prioritizing rapid triaging and clinical verification.

### Core Roles
- **Canvas / Base Background (`#F7F6F3`)**: A calm, warm limestone foundation that softens screen harshness compared to pure white.
- **Card / Surface (`#FFFFFF`)**: Pure crisp white reserved strictly for interactive modules, data cards, clinical records, and elevated surfaces to frame dense patient data.
- **Primary Brand (`#4A1F2B`)**: Deep Burgundy. Used for primary navigation states, master save actions, critical confirmations, and brand anchors.
- **Secondary Burgundy (`#70404B`)**: Mid-tone burgundy for secondary structural elements, section group headers, and nested tab bars.
- **Light Burgundy Tint (`#F3E9EB`)**: Soft wash applied to active row selections, subtle badge backgrounds, and primary pill fills.
- **Hover Burgundy (`#F0E7E8`)**: Interactive hover state for burgundy-tinted ghost elements and actionable list items.

### Typography & Structure
- **Dark Text (`#292727`)**: Near-black charcoal used for high-contrast clinical metrics, patient vitals, medication dosages, and primary table data.
- **Secondary Text (`#686563`)**: Balanced neutral grey for table headers, metadata tags, secondary timestamps, and input labels.
- **Muted Text (`#8A8783`)**: Soft stone neutral reserved for placeholders, inactive indicators, and breadcrumb dividers.
- **Border / Hairline Divider (`#E3DFDB`)**: Calibrated neutral warm stroke creating crisp boundaries without heavy contrast lines.

### Functional & Status Colors (Muted Clinical)
All semantic signals use desaturated, mineral tones rather than high-chroma or neon shades:
- **Success (`#3F6B52`)**: Forest pine. Validated test results, discharged status, normal range vitals, paid invoices.
- **Warning (`#9A6A25`)**: Amber ochre. Pending labs, critical observation watch, dosage schedule alerts, partial payments.
- **Danger (`#A33A35`)**: Brick red. Critical lab alerts, allergy contraindications, code notifications, overdue balances.
- **Info (`#665C72`)**: Dusty slate plum. Administrative notes, pending ward transfers, informational notices.

## Typography

Typographic choices are governed by instant optical scanning, clarity of numeric data, and minimal ocular tension. **Source Sans 3** is selected for its sturdy letterforms, open counters, clear distinction between uppercase `I`, lowercase `l`, and digit `1`, and natural rendering on standard institutional screens.

Tabular figures (`font-variant-numeric: tabular-nums`) must be applied globally to all clinical tables, vital monitor readouts, inventory tallies, and financial ledgers to preserve strict vertical alignment. Heading levels remain restrained in scale to preserve vertical density; hierarchy is established primarily through font weight (`600` vs `400`) and value separation (`#292727` vs `#686563`) rather than oversized sizing.

## Layout & Spacing

Hospital workflows require tight, information-rich viewports that keep vital patient signs, medication administration records (MAR), and diagnostic panels simultaneously visible without excessive scrolling.

### Layout Philosophy
- **Fluid Multi-Pane Grid**: A flexible 12-column grid optimized for wide enterprise monitors (1440px to 1920px+). Interfaces feature a persistent collapsible left navigation rail (64px collapsed, 240px expanded), an optional contextual secondary drawer (e.g., patient list, bed grid), and an active operational canvas that can split into 2- or 3-pane diagnostic comparison panels.
- **Micro-Density Spacing**: Uses a 4px baseline rhythm. Margins within table cells, list clusters, and toolbar action groups are compressed (`space-xs` to `space-md`) to ensure critical clinical data stays above the fold.
