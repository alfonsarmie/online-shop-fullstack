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
- Display family: "Anton", sans-serif. Applied to navigation labels, hero numerals, and administrative badges. Use uppercase styling, letter-spacing 0.5 px, and sizes between 18 px (navigation) and 28 px (hero callouts).
- Primary UI family: "Afacad", sans-serif. Default for forms, dashboards, checkout, and account flows.
  - Large title: 32 px, weight 700, line-height 125% (login and admin headings).
  - Section title: 24 px, weight 600, line-height 130% (cards, drawers, and modal titles).
  - Body copy: 16 px, weight 400, line-height 150% (forms, table rows, supporting text).
- Supporting family: "Raleway", sans-serif. Used for modal body text, descriptive product copy, and paragraphs that require increased legibility. Keep 16 px font size with 160% line-height.
- Numeric/technical: "Roboto Mono", 14 to 16 px, weight 400. Reserve for confirmation numbers, order IDs, and integration logs to improve digit scanning.
- Webfont delivery: Load Anton and Afacad via Google Fonts with `display=swap` and provide fallbacks `system-ui, -apple-system, "Segoe UI", sans-serif`.

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
- Floating label structure: `.form__group` keeps 20 px top padding so labels can rest inside the field until focus, with max width 420 px for desktop forms.
- Field styling: `.form__field` (Afacad 17 px) removes side borders, uses a 2 px Dock Gray underline, and hides placeholder text to let the label act as helper copy.
- Focus treatment: increase underline to 3 px and swap to a left-to-right gradient (#1E7335 → #5BC477); also bump the label to 17 px bold in Emblem Green.
- Validation: keep error copy at 14 px in Alert Red beneath the field, and reserve mono-spaced text for codes only when necessary.
- Required indicator: append `.required` span in Alert Red (#F33636) after the label; avoid mixing with iconography.
- Multi-column layouts: wrap related fields in flex rows with `gap: var(--spacing-lg)` and collapse to stacked columns below 768 px.

### 3.3 Product Cards
- Reference dimensions: 360 x 440 px on desktop, adjustable through responsive breakpoints.
- Visual hierarchy: image on top, product name (h3), brief description of up to 3 lines, and primary CTA.
- Spacing: internal padding var(--spacing-lg) with vertical gaps var(--spacing-md) between content groups.
- Dynamic states: use badges in Regatta Yellow for "New" or "Upcoming event" and labels in Alert Red for critical stock.
- Interaction: apply hover elevation (var(--shadow-elevated) shadow) and a smooth 0.2 s animation.

### 3.4 Main Navigation
- Fixed 80 px bar anchored to the top (`position: fixed; top: 0; z-index: 200`) with a Carbon Gray 94% background (#1D1D1D), 40 px horizontal padding on desktop, and brand green (#1E7335) accents.
- Primary links use "Anton" 18–20 px uppercase text with 0.5 px letter-spacing. Default color is #1E7335 and hover states expand a 2.5 px underline in #0F6823 while preserving contrast.
- Calls to action (`.btnLogIn`, `.userOptions`) adopt gradients from #1A4A2A to #1E7335, animate with subtle translateY on hover, and keep circular hit areas (40 px) for icon buttons.
- The search pattern relies on a toggle that reveals `.nav-search__form` (320 px max width on desktop, clamp to 220–260 px on mobile) with caret alignment to the trigger and focus trapping while open.
- Below 900 px the menu collapses into `.mobile-menu` drawers using the `mobileDropdownSlideIn` animation; category buttons stay in Afacad 1.15 rem text with Impulse Green highlights, and the back arrow control mirrors the hover treatment by inverting to #232323 backgrounds and white text.

### 3.5 Complex Component States
- Modal dialogs: provide loading, success, and error states leveraging the Alert Red and Canal Blue palettes with distinct icons.
- Toast notifications: stack vertically with spacing var(--spacing-sm), allow dismissal via keyboard, and enforce max width 360 px on desktop / 100% on mobile.
- Tabs: underline active tabs using Channel Green with a 3 px indicator and maintain focus outlines for keyboard navigation.

### 3.6 Page Layout Wrappers
- `.page-with-nav-spacing` ensures content clears the fixed navigation by adding 30 px top padding on desktop, reducing to 20 px below 768 px and 15 px below 480 px while maintaining a 100 vh minimum height.
- `.home-page` removes extra top padding so hero sections sit flush with the navigation, whereas `.form-page` retains the spacing to keep forms comfortably centered.
- Apply the `.admin-surface` modifier to render dashboards on a Carbon Gray background (#121212), using flex columns so nested cards stretch and the footer sticks to the bottom.
- When wrapping legacy sections like `.aboutUs-bg`, `.delivery-bg`, or `.catalogo-productos`, reset their internal top margins inside `.page-with-nav-spacing` to avoid double spacing.

### 3.7 Authentication Pages
- The authentication container (`.login-container` + `.container`) centers at 90% width with a 600 px max, 12 px rounded corners, and box-shadow `0 7px 29px rgba(100, 100, 111, 0.2)` over a white surface; collapse margins on screens under 576 px to keep focus on the form.
- Form headings use Afacad 2 rem (32 px) weight 700 in Mooring Green (#0C3F19) and support an 80 px logo above them; shrink to 1.2 rem on sub-360 px devices.
- Inputs (`.form__field`) rely on an underline system: Dock Gray at rest, Emblem Green on focus, and smooth transitions; bundle toggles such as `.password-toggle` within the same relative container.
- Primary actions (`#login-btn`) stretch to 420 px max, use Afacad 1.25 rem weight 700, Emblem Green background (#1E7335), darker hover (#072E11), a 30 px pill radius, and disabled states in Fog Gray.
- Secondary guidance (`.forgot-password`, `.link_signUp`, `.msjreg`) remains center-aligned Afacad 0.95–1 rem text with brand-colored links and adequate wrapping for narrow screens.

### 3.8 Authentication Modal
- `.lr-modal-overlay` covers the viewport with rgba(0, 0, 0, 0.6) backdrop blur and centers content at z-index 3000; maintain the fade transition when opening or closing.
- Modal surfaces (`.lr-modal-content`) cap at 400 px width, inherit 12 px radius, white background, and modal shadow `0 8px 25px rgba(0, 0, 0, 0.15)` while animating with `fadeInScale` (0.3 s cubic-bezier(0.175, 0.885, 0.32, 1.275)).
- Headers use Afacad 1.5 rem weight 700 in Mooring Green and pair with a `button.lr-close` sized at 2 rem that shifts to Mooring Green on hover; keep padding 20–25 px.
- Body copy switches to Raleway 1 rem / 1.5 line-height in Dock Gray (#5F5F5F), supporting rich text and inline links without breaking layout.
- Footer buttons (`.lr-btn`) present uppercase Afacad text, pill radius 50 px, and two variants: primary (Emblem Green, white text, translateY hover) and secondary (Fog Gray fill, Dock Gray border). On sub-480 px viewports, stack buttons vertically and stretch them to 100% width.

### 3.9 Marketing Heroes
- Home hero (`.contenedorInicio`) stretches 90 vh with imagery centered via `background-size: cover` and overlays a 40% Emblem Green tint (`.opaco`) to preserve contrast with white typography.
- Headline hierarchy: Afacad 50 px lead-in followed by Anton 70 px uppercase statement, both centered with heavy drop shadow (`rgba(0, 0, 0, 0.7)`) to stay legible over photography; scale down to 30/40 px below 600 px.
- Animated affordances such as `.scroll-down-indicator` follow the bounce keyframe (2 s, infinite) and remain white to contrast with the tinted overlay.
- Dynamic banners (`.img-dinamicas-container`) split into a dark Carbon Gray panel with 70 px Anton headlines and an interactive gallery that expands panels on hover (flex grow to 3) or animates as a carousel on touch devices.
- Maintain gallery image opacity at 0.85 by default, increasing to 1 on hover with subtle scale (1.05) and ensuring CTA overlays use Afacad uppercase buttons with brand gradients.

### 3.10 Storytelling Sections
- About and Delivery backgrounds rely on the `backgroundPulse` radial gradient animation (8 s ease-in-out) plus a lightweight dot pattern overlay at 3% Emblem Green opacity; keep motion subtle to avoid distracting copy.
- Section containers cap at 1200 px width with 40 px horizontal padding (20 px on tablets) and stagger fade-in animations (0.8 s `fadeInUp`).
- Titles: Anton 4 rem gradient text (`linear-gradient(90deg, #1E7335, #4CAF50, #1E7335)`) with text-shadow 2 px 5 px rgba(0,0,0,0.1). Reduce to 3 rem ≤992 px and 2.4 rem ≤768 px.
- Subtitles and body copy use Afacad 1.4–1.8 rem in medium Dock Gray (#5A5A5A) with line-height 1.6+. Highlighted words adopt Emblem Green and 600 weight.
- Value cards and delivery tiles employ white surfaces, 16 px corner radius, 40 px padding (25 px on mobile), and top gradient bars (#1E7335 → #4CAF50). Icons sit at 2.5–3 rem in brand green above Afacad 1.4–2.2 rem headings.
- Stats bars (`.stat-item`) fall back to transparent backgrounds with Emblem Green text and inline separators; hide separators on mobile to prevent clutter.

### 3.11 Informational Patterns
- FAQ and contact grids use responsive CSS grid with auto-fit columns minimum 300 px, 30 px gaps desktop / 20 px mobile.
- Map cards pair white surfaces and 12 px radius with subtle box-shadows (`0 12px 28px rgba(0, 0, 0, 0.12)`); bullet points use pseudo-elements colored Emblem Green.
- Emphasized notes (`.important-note`) start with Fog Gray-like fill (#E8F5E9), left border 4 px Emblem Green, and align icon + text using an 10 px gap.
- Quotes maintain italic Afacad 1.3 rem text, left border 4 px Emblem Green, and 20 px inner padding; signatures use Anton 1.2 rem uppercase with 1 px letter-spacing, right-aligned.

### 3.12 Administrative Surfaces
- Admin dashboards sit on Carbon Gray (#121212) backgrounds with 24–32 px padding and `padding-top` synced to navigation offset (>=60 px). Use Afacad for copy and Anton 32 px for page titles with subtle shadow.
- Panels (`.admin-dashboard-panel`, `.admin-orders-panel`) reuse dark surfaces (#1D1D1D) with 12 px radius, 1 px #2A2A2A borders, and internal padding 14–16 px; keep titles at 18 px Afacad, subtitles 14 px Dock Gray.
- Data tables: headers invert to darker background (#232323) with Impulse Green (#22A341) text, 16 px padding, and `text-transform: uppercase` optional. Cells hold 12–14 px Afacad in muted grays, preserving nowrap for IDs.
- Scroll regions expose custom scrollbars using #22A341 thumbs, #1D1D1D tracks, and 6 px radius for both, switching to #1E7335 on hover.
- Status badges follow color coding: Regatta Yellow for pending, Emblem Green for success, Alert Red for destructive, Dock Gray for neutral. Use 12 px pill badges with 4 px padding.
- Modal overlays inside admin flows darken the viewport with rgba(0, 0, 0, 0.7) and elevate white content containers (16 px radius, max-width 800 px) for confirmations and detail windows.
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
| --color-primary        | Color       | #1E7335                                   |
| --color-primary-hover  | Color       | #22A341                                   |
| --color-secondary      | Color       | #3498DB                                   |
| --color-danger         | Color       | #C0392B                                   |
| --color-warning        | Color       | #F39C12                                   |
| --color-surface-dark   | Color       | #1D1D1D                                   |
| --color-surface-light  | Color       | #FFFFFF                                   |
| --color-surface-muted  | Color       | #F8F9FA                                   |
| --color-overlay        | Color       | rgba(0, 0, 0, 0.6)                        |
| --gradient-brand       | Gradient    | linear-gradient(90deg, #1E7335, #4CAF50)  |
| --radius-sm            | Radius      | 4px                                       |
| --radius-md            | Radius      | 8px                                       |
| --radius-lg            | Radius      | 12px                                      |
| --radius-xl            | Radius      | 16px                                      |
| --shadow-base          | Shadow      | 0 8px 18px rgba(18, 115, 53, 0.16)        |
| --shadow-card          | Shadow      | 0 12px 28px rgba(0, 0, 0, 0.12)           |
| --shadow-panel         | Shadow      | 0 6px 20px rgba(0, 0, 0, 0.18)            |
| --shadow-modal         | Shadow      | 0 8px 25px rgba(0, 0, 0, 0.15)            |
| --font-display         | Typography  | "Anton", sans-serif                       |
| --font-headings        | Typography  | "Afacad", sans-serif                      |
| --font-body            | Typography  | "Afacad", sans-serif                      |
| --font-dialog          | Typography  | "Raleway", sans-serif                     |
| --transition-default   | Transition  | 0.2s ease                                 |
| --transition-slow      | Transition  | 0.35s cubic-bezier(0.4, 0, 0.2, 1)        |
| --spacing-xs           | Spacing     | 4px                                       |
| --spacing-sm           | Spacing     | 8px                                       |
| --spacing-md           | Spacing     | 16px                                      |
| --spacing-lg           | Spacing     | 24px                                      |
| --spacing-xl           | Spacing     | 32px                                      |
| --spacing-xxl          | Spacing     | 72px                                      |
| --size-control-md      | Dimension   | 48px                                      |
| --size-hero-height     | Dimension   | 90vh                                      |
| --size-header          | Dimension   | 80px                                      |
| --breakpoint-mobile    | Breakpoint  | 768px                                     |
| --breakpoint-nav       | Breakpoint  | 900px                                     |
| --breakpoint-tablet    | Breakpoint  | 1024px                                    |
| --breakpoint-desktop   | Breakpoint  | 1440px                                    |

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
