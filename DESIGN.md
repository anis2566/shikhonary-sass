# Design System: Admin Login - Light Mode (Super-Admin Dashboard)

**Project ID:** 11968795511017049358

## 1. Visual Theme & Atmosphere

The design radiates a **"Premium Airy Professionalism"** vibe. It utilizes extensive **Glassmorphism** (frosted glass effects) combined with a soft, multi-layered mesh background to create a sense of depth and modernity. The aesthetic is clean, high-density yet spacious, prioritizing clarity and a "state-of-the-art" software feel. It feels breathable, futuristic, and highly organized.

## 2. Color Palette & Roles

- **Deep Muted Teal (#0D9488):** The Primary brand color. Used for primary actions, active navigation states, and key icons.
- **Soft Mint Teal (#CCFBF1):** Primary Light role. Used for selection backgrounds, subtle accents, and secondary highlights.
- **Midnight Teal-Slate (#115E59):** Primary Dark role. Used for hover states on primary elements or high-contrast text.
- **Vibrant Electric Cyan (#06B6D4):** Accent color. Used in gradients (e.g., logo, buttons) to add energy and a tech-forward feel.
- **Pristine Cloud White (#F9FAFB):** Surface color. The base for cards and secondary panels.
- **Foggy Slate (#F3F4F6):** Surface Hover color. Used for subtle background changes during interaction.
- **Onyx Black-Gray (#111827):** Main Text color. Used for primary headings and critical information.
- **Cool Stone Gray (#6B7280):** Muted Text color. Used for descriptions, labels, and secondary information.
- **Mesh Slate-Blue (#F8FAFC):** The foundational background color, supporting the light blue/teal radial gradients.

## 3. Typography Rules

- **Primary Font:** **Manrope** - A modern geometric sans-serif that balances warmth with technical precision.
- **Headings:** Use `Extrabold` (800) for main numbers and `Bold` (700) for section titles. Tracking is set to "tight" for a punchy, modern look.
- **Body & Labels:** `Medium` (500) or `Semibold` (600) weight.
- **System Labels:** Small caps/uppercase labels use `Bold` weight with extra letter spacing (`tracking-widest`) to signify hierarchy.

## 4. Component Stylings

- **Buttons:**
  - **Shape:** Generously rounded corners (`rounded-xl` / 12px).
  - **Behavior:** Often feature linear gradients (Teal to Cyan) with subtle outer glows (`shadow-teal-500/20`).
- **Cards & Containers:**
  - **Shape:** Heavily rounded corners (`rounded-3xl` / 24px).
  - **Styling:** Semi-transparent white backgrounds (`bg-white/80`) with frosted glass effects (`backdrop-blur-md`).
  - **Borders:** Fine, light borders (`border-white/60`) to define edges against the mesh background.
  - **Elevations:** "Whisper-soft" diffused shadows (`shadow-soft-card`: `0 4px 20px -2px rgba(0, 0, 0, 0.05)`).
- **Inputs/Forms:**
  - **Styling:** Semi-transparent backgrounds (`bg-white/50`), `rounded-xl` corners.
  - **Interaction:** Focus states use a soft teal ring (`focus:ring-teal-500/20`) and clear border transitions.
- **Sidebar:**
  - **Styling:** Deep frosted glass (`backdrop-blur-20px`) with a high-transparency white base (`rgba(255, 255, 255, 0.85)`). Active links use a gradient fade-out and a solid left-border teal accent.

## 5. Layout Principles

- **Whitespace:** Aggressive use of padding (`p-10`) and large gaps (`gap-8`, `gap-10`) to ensure information density doesn't compromise readability.
- **Grid Alignment:** Standard 4-column stat grid for dashboards, transitioning to a split 2:1 ratio for tables and secondary widgets.
- **Consistency:** Every interactive element uses `transition-all duration-300` for smooth, micro-animated feedback.
- **Hierarchy:** Information is layered using Z-index for the glass floating header (`z-20`) and sidebar (`z-30`) to maintain context while scrolling.
