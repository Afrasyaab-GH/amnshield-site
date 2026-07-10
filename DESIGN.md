# Design System Specification: AmnShield

## 1. Overview & Identity
**Creative North Star: The Silent Guard**

AmnShield is the product landing page for Al-Haq's flagship digital protection suite (app blocker, keyword filter, content moderation). The design system balances safety, privacy, and modern app interfaces. The UI needs to convey **Security**, **Privacy-First (Local AI)**, and **Productive Quietness**. It achieves this through clean grids, phone mockup structures, trust badges, and prominent call-to-actions, utilizing the signature Al-Haq deep blue and gold.

## 2. Color Palette & Tonal Depth

AmnShield shares the unified Al-Haq corporate colors, utilizing tonal surface containers to represent layers of security protection.

### Corporate Tones (Tailwind Config)
*   **Primary:** `#0A2540` (Deep Blue) — Represents security, depth, and trust. Main header and CTA background.
*   **Secondary:** `#D4AF37` (Gold) — Represents premium quality, faith alignment, and highlighted status badges.
*   **Background Base:** `#f8f9fc` — Main body background.
*   **Surface Lowest:** `#ffffff` — Used for content blocks, testimonials, and features to stand out against the background.
*   **Surface Low:** `#f5f7fb` — Neutral background for alternating sections.
*   **Outline-Variant:** `#d1d5db` — Soft borders for screen mockups and layout columns.

### Dark Mode Mapping
*   **Background Base:** `#0b1220` (Dark Space)
*   **Surface Lowest:** `#1e293b` (Active container)
*   **Surface Low:** `#0f172a` (Inner panels)
*   **Text Primary (`text-on-surface`):** `#f8fafc` (Bright white)
*   **Text Secondary (`text-on-surface-variant`):** `#94a3b8` (Muted Slate)
*   **CTA Contrast Swap:** In dark mode, `.bg-primary` transitions to Gold (`#D4AF37`) with Deep Blue text (`#0A2540`) to maintain a prominent focus for download buttons.

## 3. Typography
The typography contrasts editorial headers with a clean, tech-oriented reading experience.

*   **Display & Headlines (`Source Serif 4`):** Used for titles, hero headers, and value propositions. Instills a premium, trustworthy look.
*   **Body & Labels (`Inter`):** Used for feature descriptions, bullet lists, technical specifications, and download buttons.
*   **Icon Typography (`Material Symbols Outlined`):** Used for security checkmarks, shield emblems, and navigation indicators.

## 4. Spacing & Structure
*   **Layout Grid:** Standard 1280px max-width container, featuring flexible 3-column benefit grids and staggered 2-column alternating text/screenshot splits.
*   **Device Framing:** App screenshots should be presented in simplified flat mockups with a very thin outline border (`#d1d5db`) and a subtle background elevation shift.
*   **Roundedness:**
    *   Buttons: `0px` (or standard `0.125rem` sharp edges) to convey structure and discipline.
    *   Mockup Frames: `1rem` (to mimic actual mobile device screens).

## 5. Key Components

### App Feature Columns
*   Grid blocks highlighting key tools: Blocker, Filter, Moderation, Focus.
*   Uses light containers with high contrast outline-variants.

### Download CTA Module
*   A solid primary background block with gold highlights and secondary white buttons, framing links to the Google Play Store or APK downloads.

### Status Badges
*   Faith-aligned status tags like "100% On-Device AI" or "Privacy-First" highlighted using gold secondary borders.

## 6. Motion & Animations
*   **Transitions:** Fast but smooth `300ms` transitions on color, opacity, and button hovers.
*   **Micro-interactions:** Buttons expand slightly or reduce opacity on hover. Nav menu items transition text color cleanly.
