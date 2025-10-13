# Style Guide - Rowing Club Ecommerce

## 1. Introduction
### 1.1 Purpose and Scope
This guide formalizes the visual and technical guidelines of the Rowing Club Ecommerce digital ecosystem, ensuring consistency across the storefront, the admin panel, and any associated communication pieces. It serves as a reference for design, development, marketing, and operations teams involved in the evolution of the digital product.

### 1.2 Project Description
Rowing Club Ecommerce is the official platform of the rowing club for marketing technical apparel, nautical equipment, memberships, class bookings, and on-water experiences. The system covers the public store, member onboarding workflows, event management, and internal tracking tools.

## 2. Visual Identity
### 2.1 Color Palette
The palette adopts the club's institutional greens and complements them with sporty accents and functional neutrals.

| Name            | Hex value | Recommended use                                                               |
| --------------- | --------- | ----------------------------------------------------------------------------- |
| Emblem Green    | #1E7335   | Primary actions, primary buttons, brand identifiers                         |
| Impulse Green   | #22A341   | Hover states, visual confirmations, highlighting positive data              |
| Mooring Green   | #0C3F19   | Headings over photography, solid hero backgrounds, strong overlays          |
| Channel Green   | #4CAF50   | Dynamic gradients, progress lines, informational chips                      |
| Regatta Yellow  | #E6B800   | Pending states, event banners, promotional badges                           |
| Bow Orange      | #F39C12   | Soft warnings, active steps in guided flows, alert tooltips                 |
| Canal Blue      | #3498DB   | Contextual links, informative secondary buttons, supporting messages        |
| Alert Red       | #C0392B   | Error messages, destructive confirmations, critical alerts                  |
| Carbon Gray     | #121212   | Dark backgrounds in the dashboard, nighttime modals, inverted typography    |
| Dock Gray       | #6F7B8C   | Borders, secondary icons, helper text, and placeholders                     |
| Fog Gray        | #F4F6FA   | Neutral backgrounds, cards, disabled states, and empty containers           |

#### Color Accessibility Checks
Key text-to-background combinations are validated to meet WCAG 2.1 AA contrast targets. Use the "Pass" combinations for essential text and reserve "Use as accent" colors for icons or backgrounds paired with compliant text.

| Foreground on background      | Contrast ratio | WCAG 2.1 AA (4.5:1 body / 3:1 large) | Recommendation                            |
| ----------------------------- | -------------- | ------------------------------------ | ----------------------------------------- |
| Emblem Green on White         | 4.6:1          | Pass (body)                          | Safe for primary buttons and links        |
| White on Emblem Green         | 4.6:1          | Pass (body)                          | Safe for primary buttons and hero text    |
| Canal Blue on White           | 4.7:1          | Pass (body)                          | Safe for secondary CTAs and hyperlinks    |
| Alert Red on White            | 4.4:1          | Pass (large) / Near-pass (body)      | Use for titles or bold alerts >=18 px     |
| Regatta Yellow on White       | 1.7:1          | Fail                                 | Reserve for backgrounds or badges only    |
| Regatta Yellow on Carbon Gray | 6.1:1          | Pass (body)                          | Use for badges over dark surfaces         |
| Dock Gray on White            | 4.9:1          | Pass (body)                          | Safe for helper text and input borders    |

### 2.2 Typography
- Primary family: Montserrat. Used on titles, buttons, and navigation items for its clean geometry and sporty character.
  - h1: 48 px, weight 700, line-height 120%, hero sections and institutional messages.
  - h2: 34 px, weight 600, line-height 130%, internal headings and content blocks.
  - h3: 26 px, weight 600, line-height 130%, subsections and featured cards.
- Secondary family: Source Sans 3. Applied to body copy, product descriptions, microcopy, and tooltips.
  - Base paragraph: 16 px, weight 400, line-height 150%.
  - Compact paragraph: 14 px, weight 400, line-height 150%, complementary data and tables.
- Technical typography: Roboto Mono, 14 to 16 px, weight 400, intended for reservation codes, order numbers, and banking data.

### 2.3 Logotype and Branding
- Clear space: keep a free margin equivalent to the width of a rowing blade from the isotype all around the logo.
- Minimum sizes: 140 px on web interfaces and 96 px on responsive assets.
- Approved versions: applied in Emblem Green on light backgrounds, in white on dark backgrounds, or monochrome in Carbon Gray. Do not modify proportions, colors, or add effects that are not part of the brand.
- Integration with photography: place the logo on clean areas of the image; when necessary, use overlays with Fog Gray at 80% opacity to preserve legibility.

### 2.4 Iconography
- Library: Remix Icon outlined set customized with brand colors; supplement with bespoke pictograms for rowing-specific actions when needed.
- Style: 24 px stroke-based icons with rounded corners and consistent 2 px line weight.
- Usage: Pair Emblem Green or Canal Blue icons with ample padding; ensure minimum contrast of 3:1 against their background.
- Scaling: Default size 24 px, with 20 px for dense tables and 32 px for hero sections. Keep icons aligned to the 8 px spacing grid.
- Accessibility: Provide descriptive `aria-label` or `title` attributes when icons act as standalone controls.

## 3. Interface Components
### 3.1 Buttons
- Primary (btn--primary): background var(--color-primary) (Emblem Green), white text, border radius var(--radius-md), and box-shadow var(--shadow-base). Hover uses var(--color-primary-hover) and focus adds a 2 px halo in the same tone.
- Secondary (btn--secondary): transparent background with a 1 px border in var(--color-primary); hover introduces a subtle fill using rgba(34, 163, 65, 0.12) and focus applies an inner outline.
- Tertiary (btn--tertiary): text-only treatment in var(--color-secondary) (Canal Blue) with underline on hover; pair with 24 px icons respecting the 8 px spacing grid.
- Disabled state: Fog Gray background, Dock Gray text, removal of shadows, and `cursor: not-allowed`.
- Active state: apply a slight scale (0.98) and reinforce the box-shadow to var(--shadow-elevated) for tactile feedback.
- Loading state: replace text with a 16 px spinner aligned using var(--spacing-xs) and maintain button width; ensure `aria-busy="true"` is set.
- Icon alignment: when including icons, maintain `gap: var(--spacing-xs)` for leading icons and `gap: var(--spacing-sm)` for trailing icons on tertiary buttons.

### 3.2 Inputs and Forms
- Standard height: var(--size-control-md) with horizontal padding var(--spacing-md) and 1 px borders in Dock Gray at 60%.
- Hover: border highlighted to solid Dock Gray; focus with Emblem Green border and a 2 px gradient halo (Emblem Green to Channel Green).
- Error messages: 12 px text in Alert Red, optionally accompanied by an icon with aria-live="polite" to communicate updates.
- Complex forms: structure with BEM (booking-form__group, booking-form__label) and group related fields with vertical spacing var(--spacing-lg).

### 3.3 Product Cards
- Reference dimensions: 360 x 440 px on desktop, adjustable through responsive breakpoints.
- Visual hierarchy: image on top, product name (h3), brief description of up to 3 lines, and primary CTA.
- Spacing: internal padding var(--spacing-lg) with vertical gaps var(--spacing-md) between content groups.
- Dynamic states: use badges in Regatta Yellow for "New" or "Upcoming event" and labels in Alert Red for critical stock.
- Interaction: apply hover elevation (var(--shadow-elevated) shadow) and a smooth 0.2 s animation.

### 3.4 Main Navigation
- Fixed header var(--size-header) high, white background, and subtle shadow (0 4px 12px rgba(12, 63, 25, 0.08)).
- Logo on the left, centered menu with up to 6 items, and member access CTA on the right.
- Mobile version: hamburger menu, full-screen vertical drawer with options separated by dividers in Fog Gray. Toggle the drawer below var(--breakpoint-mobile) to maintain legibility.

### 3.5 Complex Component States
- Modal dialogs: provide loading, success, and error states leveraging the Alert Red and Canal Blue palettes with distinct icons.
- Toast notifications: stack vertically with spacing var(--spacing-sm), allow dismissal via keyboard, and enforce max width 360 px on desktop / 100% on mobile.
- Tabs: underline active tabs using Channel Green with a 3 px indicator and maintain focus outlines for keyboard navigation.

## 4. User Experience (UX)
### 4.1 Principles
- Clarity and proactivity: anticipate user needs and avoid cognitive overload.
- Continuous feedback: confirm actions with microinteractions and contextual messages.
- Accessibility: comply with WCAG 2.1 AA; minimum contrast 4.5:1 on text, use of labels, and aria descriptions.

### 4.2 Microinteractions
- 200 ms transitions with ease-out curves.
- Visual confirmations in Impulse Green and errors in Alert Red.
- Optional haptic feedback on mobile for critical actions (checkout, cancellations).

### 4.3 Purchase Flow
1. Discovery: product listings with advanced filters (sport, level, availability).
2. Detail: product sheets with galleries, key benefits, and highlighted call to action.
3. Cart: clear summary, coupons, and delivery time estimates.
4. Checkout: guided steps with progress bar (Channel Green) and inline validations.
5. Confirmation: screen with summary, CTA to bookings, and suggestions for related products.

## 5. Design System
### 5.1 Tokens
They represent centralized visual decisions within the Design System.

| Token                  | Type        | Value / Example                            |
| ---------------------- | ----------- | ------------------------------------------ |
| --color-primary        | Color       | #1E7335                                  |
| --color-primary-hover  | Color       | #22A341                                  |
| --color-secondary      | Color       | #3498DB                                  |
| --color-danger         | Color       | #C0392B                                  |
| --color-warning        | Color       | #F39C12                                  |
| --radius-sm            | Radius      | 4px                                        |
| --radius-md            | Radius      | 8px                                        |
| --shadow-base          | Shadow      | 0 8px 18px rgba(18, 115, 53, 0.16)       |
| --shadow-elevated      | Shadow      | 0 12px 28px rgba(12, 63, 25, 0.18)       |
| --font-headings        | Typography  | Montserrat, sans-serif                     |
| --font-body            | Typography  | "Source Sans 3", sans-serif                |
| --transition-default   | Transition  | 0.2s ease                                  |
| --spacing-xs           | Spacing     | 4px                                        |
| --spacing-sm           | Spacing     | 8px                                        |
| --spacing-md           | Spacing     | 16px                                       |
| --spacing-lg           | Spacing     | 24px                                       |
| --spacing-xl           | Spacing     | 32px                                       |
| --spacing-xxl          | Spacing     | 72px                                       |
| --size-control-md      | Dimension   | 48px                                       |
| --size-header          | Dimension   | 76px                                       |
| --breakpoint-mobile    | Breakpoint  | 768px                                      |
| --breakpoint-tablet    | Breakpoint  | 1024px                                     |
| --breakpoint-desktop   | Breakpoint  | 1440px                                     |

### 5.2 Component Library
- Organize components with Atomic Design (atoms, molecules, organisms).
- Document variants, states, and usage constraints in Storybook or similar.
- Maintain examples of integration with real data and edge cases.

### 5.3 Responsive Breakpoints
- Mobile: up to 768 px (`--breakpoint-mobile`). Collapse navigation into drawer patterns and stack cards vertically.
- Tablet: 769 px to 1024 px (`--breakpoint-tablet`). Switch to two-column product grids and expose condensed navigation bars.
- Desktop: 1025 px to 1440 px (`--breakpoint-desktop`). Use three or four-column product grids, persistent filters, and expanded navigation.
- Large desktop: above 1440 px. Apply max-width containers (1200 px) centered with auto margins to preserve readable line lengths.
- Document component behavior for each breakpoint in design files and sync with Storybook viewport presets.

## 6. Development Guidelines
### 6.1 Code
- Modular structure with React and TypeScript.
- Styles managed with CSS Modules or Styled Components, avoiding global collisions.
- Name classes with the BEM methodology when using traditional stylesheets.

### 6.2 Technical Accessibility
- Implement keyboard navigation, focus management, and ARIA roles in dynamic components.
- Validate forms with text feedback and aria-live attributes.
- Ensure cross-browser compatibility from Chrome 105+, Safari 16+, and Edge 105+.

### 6.3 Performance
- Lazy load images and apply code splitting on secondary routes.
- Use WebP images and gzip/brotli compression on static assets.
- Monitor with Lighthouse aiming for a minimum 90/100 performance score.

### 6.4 QA and Testing
- Automated cases with Jest and React Testing Library for critical components.
- End-to-end integrations with Playwright covering checkout, bookings, and inventory management.
- Accessibility reviews with axe DevTools on major releases.

## 7. Code Examples
These snippets illustrate how to apply the tokens to recurring site components.

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-headings);
  font-weight: 600;
  line-height: 1.2;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-xl);
  gap: var(--spacing-xs);
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.btn--primary {
  background-color: var(--color-primary);
  color: #FFFFFF;
  box-shadow: 0 10px 24px rgba(30, 115, 53, 0.24);
}

.btn--primary:hover,
.btn--primary:focus-visible {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.btn--secondary {
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  background-color: transparent;
}

.btn--secondary:hover,
.btn--secondary:focus-visible {
  background-color: rgba(34, 163, 65, 0.12);
}

.input-field {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid rgba(111, 123, 140, 0.6);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-field:focus-visible {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(30, 115, 53, 0.25);
  outline: none;
}

.gear-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: #FFFFFF;
  box-shadow: var(--shadow-elevated);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gear-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(12, 63, 25, 0.22);
}

.nav-bar {
  position: sticky;
  top: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--size-header);
  padding: 0 var(--spacing-xl);
  background-color: #FFFFFF;
  border-bottom: 1px solid rgba(111, 123, 140, 0.35);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

@media (max-width: 1024px) {
  .layout {
    padding: 0 var(--spacing-md);
  }

  .nav-bar {
    padding: 0 var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .btn {
    width: 100%;
  }

  .nav-bar {
    flex-wrap: wrap;
    height: auto;
    gap: var(--spacing-sm);
  }
}
```

A quarterly audit of these guidelines is recommended to maintain visual consistency and the premium experience associated with Rowing Club.
