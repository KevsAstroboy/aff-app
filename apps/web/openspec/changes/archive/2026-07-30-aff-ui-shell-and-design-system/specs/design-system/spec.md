# Design System & Layout Shell

## Purpose

Établir le système de design (tokens), la coquille de mise en page (sidebar + topbar) et la façade de données qui serviront de base à toutes les pages publiques et admin.

## ADDED Requirements

### Requirement: Public layout shell
The public app MUST render a fixed 256px left sidebar with logo, primary navigation, "S'inscrire" CTA, and a top bar with page title region + notification icons + user avatar, on screens ≥ md. On screens < md the sidebar MUST collapse into a hamburger-triggered drawer.

#### Scenario: Desktop renders full shell
- **WHEN** user opens a public route on a screen ≥ 768px wide
- **THEN** the fixed sidebar AND top bar are visible simultaneously
- **AND** the main content fills the remaining width

#### Scenario: Mobile collapses to drawer
- **WHEN** user opens a public route on a screen < 768px wide
- **THEN** only the top bar with a hamburger button is visible
- **AND** tapping hamburger opens the sidebar as a drawer overlay

### Requirement: Admin layout shell
The /admin route group MUST render a darker variant of the shell with: (a) "Accès administrateur" red-tinted pill below the logo, (b) NAVIGATION section heading above nav items, (c) each nav item MAY carry a red numeric badge for pending counts, (d) "Retour à l'application" footer link above the user profile card.

#### Scenario: Admin shell visual differentiation
- **WHEN** user navigates to any /admin route
- **THEN** the sidebar uses a darker surface color than the public sidebar
- **AND** the "Accès administrateur" red pill appears directly below the logo
- **AND** the "NAVIGATION" uppercase label appears above the nav items

### Requirement: Page header
Every page MUST begin with a PageHeader block containing an optional eyebrow (UPPERCASE amber), an H1, and an optional subtitle, left-aligned with consistent vertical rhythm (≥ 32px gap below).

#### Scenario: Header renders all three elements
- **WHEN** a page composes PageHeader with eyebrow + title + subtitle
- **THEN** all three are stacked vertically with the eyebrow first in uppercase amber
- **AND** the H1 follows with the title
- **AND** the subtitle renders below in muted color

### Requirement: Color discipline
Components MUST reference semantic Tailwind tokens (bg-surface, text-gold, border-default) — never raw hex. New colors MUST NOT be introduced without updating the token map in tailwind.config.ts.

#### Scenario: Hex audit
- **WHEN** `grep -rE '#[0-9a-fA-F]{3,6}' components/` is run
- **THEN** only token files (tailwind.config.ts, globals.css) contain hex values
- **AND** all component files reference semantic tokens

### Requirement: Typography
Display headings MUST use Inter with `font-variant-numeric: tabular-nums` for numeric KPIs. Eyebrow labels MUST be uppercase 11–12px with `letter-spacing` ≥ 0.15em.

#### Scenario: KPI numeric alignment
- **WHEN** multiple KPI cards render side by side
- **THEN** digit columns align vertically across cards

### Requirement: Status pills
StatusPill MUST map status → {color, label} via a single config object (`lib/status-config.ts`). New statuses MUST be added to the config, not handled inline.

#### Scenario: Centralized status mapping
- **WHEN** a new status kind is needed in the UI
- **THEN** the developer adds an entry to STATUS_CONFIG in lib/status-config.ts
- **AND** no inline conditional color logic exists in consuming components

### Requirement: Action button grammar
Admin row actions MUST use: square icon-only for view/edit, red-outlined ghost for destructive (suspend/cancel/delete), green-outlined ghost for constructive (validate/activate). Buttons in a row MUST share height and visual weight.

#### Scenario: Admin action row consistency
- **WHEN** any admin table renders a row of actions
- **THEN** all icons share the same square dimensions
- **AND** destructive actions use red-outlined ghost variant
- **AND** constructive actions use green-outlined ghost variant

### Requirement: Service facade
All data access MUST go through async functions in `services/` that return typed promises. Components MUST NOT import from `mock/` directly. Swapping a service to a real `fetch` call MUST be a single-function-body change.

#### Scenario: Service import boundary
- **WHEN** a grep is run for direct mock imports from components
- **THEN** no matches exist outside services/ files

### Requirement: Loading and empty states
Each service MUST simulate 200–500ms latency in development. Components rendering lists MUST render a Skeleton variant during loading and an EmptyState when the array is empty.

#### Scenario: Loading state visible
- **WHEN** a component fetches data via a service
- **THEN** a Skeleton placeholder renders during the 200–500ms simulated delay

#### Scenario: Empty state for empty arrays
- **WHEN** a service returns an empty array
- **THEN** the consuming component renders an EmptyState (icon + message) instead of an empty list

### Requirement: Cross-cutting state
Modal open state and current-user identity MUST live in Zustand stores. Page-local state (filters, form inputs) MUST use `useState`.

#### Scenario: Modal state isolation
- **WHEN** the Inscription modal is opened from the sidebar button
- **THEN** the modal store's `openInscription()` triggers the modal to render
- **AND** no prop drilling is required through intermediate components

### Requirement: Focus and keyboard
All interactive elements MUST have a visible focus ring (`ring-2 ring-gold-soft ring-offset-2 ring-offset-bg`) and MUST be reachable via Tab. Icon-only buttons MUST carry `aria-label`.

#### Scenario: Keyboard navigation
- **WHEN** user presses Tab repeatedly from the sidebar logo
- **THEN** every nav item, action button, and form input becomes focused in DOM order
- **AND** each focused element displays a gold focus ring

### Requirement: Contrast
Body text on `bg` MUST meet WCAG AA (≥ 4.5:1). Muted text on `bg` MUST meet AA Large (≥ 3:1) or carry an icon/visual aid.

#### Scenario: Text passes contrast check
- **WHEN** body text renders on bg (#000000)
- **THEN** the text color (#F5F5F5) yields contrast ≥ 15:1 (AA + AAA pass)

### Requirement: Breakpoints
Layouts MUST adapt at `sm` (640), `md` (768), `lg` (1024), `xl` (1280), `2xl` (1536). Sidebar MUST become a drawer below `md`. Multi-column grids MUST collapse to single column below `md`.

#### Scenario: Grid collapse at md
- **WHEN** viewport width crosses the 768px threshold
- **THEN** multi-column grids collapse to a single column
- **AND** the sidebar swaps between fixed and drawer mode

### Requirement: Server Components by default
Page routes that render purely from service data MUST be Server Components. Client Components MUST be limited to interactive widgets (Modal, Tabs, Countdown, PostCard reactions).

#### Scenario: Server Component data fetch
- **WHEN** a page calls `await getDashboard()` at the top level
- **THEN** the file has no "use client" directive at the top

### Requirement: No raw imports from mock
Components MUST NOT directly import from `mock/`. All data access MUST go through `services/`.

#### Scenario: Import boundary check
- **WHEN** a grep searches for `from "@/mock` in components/ directories
- **THEN** zero results are returned
