# Public Pages

## Purpose

Implémenter les 13 routes publiques de l'Africa Future Festival 2026 consommant la coquille et le système de design livrés dans `aff-ui-shell-and-design-system`. Chaque route correspond exactement à un écran du dossier `design/`.

## ADDED Requirements

### Requirement: Home page surfaces festival identity
The `/` route MUST display: page eyebrow "Édition 2026", title "AFRICA FUTURE FESTIVAL", location subtitle, "Entrée gratuite" tag, 4 StatCards (Participants / Disciplines / Exposants / Awards), live countdown to festival opening, discipline chip strip, and a featured sponsor/partners strip.

#### Scenario: Home renders all sections
- **WHEN** user opens `/`
- **THEN** all 7 sections render in vertical order with consistent spacing

### Requirement: Actualites page shows live feed
The `/actualites` route MUST display a page header "Live Feed" with a red dot "En direct" indicator, followed by a vertical list of post cards. Each card MUST show a category tag (ANNONCE, RECORD GUINNESS, PARTENARIAT, or HOT), title, description excerpt, reactions row, share and comment counts, and a relative timestamp.

#### Scenario: Live feed renders posts in order
- **WHEN** user opens `/actualites`
- **THEN** posts render in newest-first order
- **AND** each post displays a colored category tag matching its kind

### Requirement: Masterclass list page
The `/masterclass` route MUST display a grid of masterclass cards. Each card MUST show: community tag, status pill (En direct / En attente / Terminée / Annulée), title, expert name, time slot, capacity progress bar with current/max participants.

#### Scenario: Masterclass cards show capacity
- **WHEN** a masterclass card renders
- **THEN** a progress bar shows current participants / max capacity
- **AND** the bar turns red when capacity is exceeded

### Requirement: Masterclass live view is three-column
The `/masterclass/[id]/live` route MUST render a 3-column layout on screens ≥ lg: left column = list of other sessions (masterclass cards with community tag + status), center column = active session display (large circular avatar + expert name + role + HD badge + participant avatars row + reaction bar + leave button), right column = participants list (avatar + name + role pill + country flag + mic toggle). On screens < lg the left column collapses to a top horizontal scroll and the right column becomes a modal triggered by a "Participants" button.

#### Scenario: Three columns visible on desktop
- **WHEN** user opens a live masterclass on a screen ≥ 1024px
- **THEN** the session list, active session display, and participants list are all visible simultaneously

### Requirement: Feed page is three-column
The `/feed` route MUST render a 3-column layout on screens ≥ xl: left column = communauté filter list (Tout + 6 communautés with post counts), center column = post composer + feed post cards, right column = Tendances (top hashtags with counts) + Membres actifs list. On screens < xl the right column is hidden and on < lg the filter sidebar collapses to a top dropdown.

#### Scenario: Feed filters work
- **WHEN** user clicks a communauté filter chip
- **THEN** the center column shows only posts from that communauté
- **AND** the active filter chip displays in highlighted state

### Requirement: Programme page uses tabs and timeline
The `/programme` route MUST display a Tabs component with "Samedi 19 Août" and "Dimanche 20 Août" as default options, followed by a vertical timeline list of TimelineEvent components for the selected day. Each event MUST show: start time (gold large), title, optional expert, venue, optional HOT badge, "Ajouter à mon calendrier" button, and favorite heart icon.

#### Scenario: Tabs switch days
- **WHEN** user clicks the "Dimanche 20 Août" tab
- **THEN** the timeline updates to show only events for that day

### Requirement: Awards page shows grand prix then categories
The `/awards` route MUST display: page header, 4 StatCards (Trophées / Jury international / Vote live / Cérémonie date), a featured Grand Prix card with gold border + trophy watermark + apply CTA, then CategorySection per section heading (Image & Visuel, Son & Scène, Mode & Style, Digital & Influence, Architecture & Espace, Entrepreneuriat & Impact, Catégories spéciales) each rendering its CategoryCards in a 2-column grid. A final CTA banner "Candidatures ouvertes jusqu'au 30 Juillet 2026" with download button MUST appear at the bottom.

#### Scenario: Categories grouped by section
- **WHEN** user opens `/awards`
- **THEN** categories are visually grouped under their section headings
- **AND** each section's categories render in a 2-column grid

### Requirement: Profile page shows user identity and stats
The `/profil` route MUST display: user header card (large avatar + name + role pill + 3 inline stats: Connexions / Sessions favorites / Candidatures Awards), official badge card (gold border + "AFF. 2026" + barcode-style decorative bars + download + share buttons), 5 quick-link cards (Mes candidatures Awards / Mon programme personnalisé / Mon réseau créatif / Mon portfolio gallery / Paramètres du compte), and a participation statistics row (Profil complété / Sessions inscrites / Évènements passés / Badges collectés).

#### Scenario: Profile shows all sections
- **WHEN** user opens `/profil`
- **THEN** header card, badge card, 5 quick-link cards, and stats row render in that order

### Requirement: Profile sub-pages exist for all quick links
The 5 quick-link cards on `/profil` MUST each navigate to a working sub-route: `/profil/candidatures`, `/profil/programme`, `/profil/reseau`, `/profil/portfolio`, `/profil/parametres`. Each sub-route MUST render its content using the existing services and components.

#### Scenario: All quick-link routes resolve
- **WHEN** user clicks any quick-link card on `/profil`
- **THEN** the corresponding sub-route loads with HTTP 200 and renders its content

### Requirement: Messages page is two-pane chat
The `/messages` route MUST display a 2-pane layout: left pane = search input + conversation list (ConversationItem cards with unread badge), right pane = active conversation header (avatar + group name + member count + menu) + message list (ChatBubble alternating mine/other) + ChatInputBar at bottom. Clicking a conversation MUST load its messages.

#### Scenario: Selecting a conversation loads messages
- **WHEN** user clicks a ConversationItem in the list
- **THEN** the right pane updates to show that conversation's messages
- **AND** the clicked item shows active state

### Requirement: Loading and empty states
Every list rendering route MUST handle the 200–500ms simulated service latency with a Skeleton placeholder and render an EmptyState component when the service returns an empty array.

#### Scenario: Empty state shown when no posts
- **WHEN** the actualites service returns an empty array
- **THEN** the page renders the EmptyState component instead of an empty list
