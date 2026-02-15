# Shikhonary Admin Design System - Premium Dark Mode

**Source Screen ID**: `29a67e3a9fe54b2893cef88f35f0b381`
**Theme Title**: Super-Admin Premium Dark Aesthetics

## 1. Visual Theme: "Obsidian Professionalism"

The design leverages a deep, dark obsidian base with vibrant teal-cyan accents and subtle violet gradients. It creates a high-contrast, premium experience emphasizing depth through glassmorphism and soft glows.

## 2. Color Palette

### Base Colors

- **Main Background (Obsidian)**: `#0A0514`
- **Surface (Luxury Dark)**: `#0F0B1E`
- **Sidebar Background**: `#0B0C1E`
- **Panel Background (Frosted)**: `rgba(20, 20, 35, 0.4)`
- **Glass Base**: `rgba(13, 11, 22, 0.6)`

### Accents & Indicators

- **Primary Teal Cyan**: `#22d3ee`
- **Deep Violet**: `#5b21b6`
- **Text (High Contrast)**: `#f3f4f6`
- **Text (Secondary/Muted)**: `rgba(199, 210, 254, 0.6)` (indigo-200/60)

### Borders & Dividers

- **Subtle White Outlines**: `rgba(255, 255, 255, 0.05)` (sidebar-border)
- **Glass Borders**: `rgba(255, 255, 255, 0.08)`
- **Panel Borders**: `rgba(255, 255, 255, 0.12)`

## 3. Typography

- **Core Font**: `Manrope`
- **Weights**: 300, 400, 500, 600, 700, 800
- **Scale**:
  - Dashboard Title: `24px` / `text-2xl`
  - Body Text: `14px` / `text-sm`
  - Small/Muted: `12px` / `text-xs`
  - Labels: `10px` / `tracking-wider uppercase`

## 4. Component Styling

### Sidebar (Aside)

- **Width**: `16rem` (w-64)
- **Background**: `#0B0C1E`
- **Active State**:
  - Background: `rgba(34, 211, 238, 0.1)` (teal-cyan/10)
  - Text: `#22d3ee` (teal-cyan)
  - Border: `1px solid rgba(34, 211, 238, 0.2)`
  - Shadow: `0 0 15px rgba(34, 211, 238, 0.1)`
- **Hover State**:
  - Background: `rgba(255, 255, 255, 0.05)` (white/5)
  - Transition: `0.2s ease`

### Dashboard Header

- **Height**: `5rem` (h-20)
- **Background**: `rgba(10, 5, 20, 0.4)` (obsidian/40) with `backdrop-blur-md`
- **Search Input**:
  - Background: `rgba(255, 255, 255, 0.05)`
  - Border: `rgba(255, 255, 255, 0.1)`
  - Focus Ring: `rgba(34, 211, 238, 0.6)`

### Metric Cards

- **Background**: `linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)`
- **Borders**: `1px solid rgba(255, 255, 255, 0.1)`
- **Effects**: `backdrop-blur(16px)`
- **Shadow**: `0 20px 40px -10px rgba(0,0,0,0.4)`
- **Hover**:
  - Border Color: `rgba(34, 211, 238, 0.4)`
  - TranslateY: `-4px`
  - Shadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 15px rgba(34, 211, 238, 0.15)`

## 5. Layout & Effects

- **Background Gradient**: `linear-gradient(160deg, #0f0b1e 0%, #050505 100%)`
- **Mesh Background**:
  - Top Right: `radial-gradient(circle at top right, rgba(34, 211, 238, 0.15), transparent 40%)`
  - Bottom Left: `radial-gradient(circle at bottom left, rgba(91, 33, 182, 0.2), transparent 40%)`
- **Patterns**: Bengali Pattern SVG at `0.03` opacity.
