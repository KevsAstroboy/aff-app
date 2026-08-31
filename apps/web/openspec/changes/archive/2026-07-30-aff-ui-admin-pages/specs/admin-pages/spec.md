# Admin Pages

## Purpose

Implémenter les 6 routes admin de modération : utilisateurs, communautés, publications, masterclasses, commentaires, signalements. Toutes utilisent la coquille admin déjà livrée (Sidebar variant sombre + badges compteurs + Topbar) et les services façade existants.

## ADDED Requirements

### Requirement: Admin sidebar reflects pending counts
The admin sidebar MUST display red numeric badges on nav items with pending actions (Utilisateurs 1, Publications 2, Masterclasses 1, Commentaires 1, Signalements 2). Clicking a nav item MUST navigate to the corresponding admin route.

#### Scenario: Sidebar badges visible
- **WHEN** admin renders any /admin route
- **THEN** the sidebar shows numeric badges on the 5 items with pending counts

### Requirement: Users admin page lists all users
The /admin/utilisateurs route MUST display: breadcrumb "Admin > Utilisateurs", page header "Utilisateurs", SearchInput + status Select + "Ajouter" Button + export icon button, AdminTable with columns UTILISATEUR (Avatar + name + flag), EMAIL, COMMUNAUTÉ, RÔLE, STATUT (StatusPill), INSCRIPTION (date), ACTIONS (Voir / Suspendre or Valider depending on status / Delete).

#### Scenario: User row shows actions based on status
- **WHEN** user has status "active"
- **THEN** the actions column shows Voir / Suspendre / Delete
- **WHEN** user has status "waiting" or "suspended"
- **THEN** the actions column shows Voir / Valider / Delete

### Requirement: Communautes admin page shows card grid
The /admin/communautes route MUST display: breadcrumb, page header, SearchInput + "Nouvelle communauté" Button, grid of CommunauteCard components (avatar circle with community color + name + StatusPill + description + members + publications + creation date + Activer/Désactiver Button + edit + delete icon buttons).

#### Scenario: Toggle community status
- **WHEN** admin clicks Désactiver on an active community
- **THEN** the StatusPill changes to "Inactif"
- **AND** the button text changes to "Activer"

### Requirement: Publications admin page shows moderation table
The /admin/publications route MUST display: breadcrumb, page header, SearchInput + status Select + filter icon, AdminTable with columns AUTEUR (name + communauté tag), EXTRAIT (body truncated), STATUT (StatusPill), RÉACTIONS (count + comments count), DATE (relative), ACTIONS (Voir / Valider / Rejeter / Delete). Pending publications MUST show Valider + Rejeter actions. Published MUST show only Voir + Delete.

#### Scenario: Validate moves publication to published
- **WHEN** admin clicks Valider on a pending publication
- **THEN** its status pill changes to "Publié"
- **AND** the Valider/Rejeter actions disappear

### Requirement: Masterclasses admin page shows session table
The /admin/masterclasses route MUST display: breadcrumb, page header, "Nouvelle masterclass" Button + filter icon, AdminTable with columns SESSION (title + duration), EXPERT, COMMUNAUTÉ (tag), DATE, PARTICIPANTS (ProgressBar + ratio), STATUT (StatusPill), ACTIONS (Voir / Activer / Annuler / Delete).

#### Scenario: Activate changes status to live
- **WHEN** admin clicks Activer on a pending masterclass
- **THEN** its StatusPill changes to "En direct"
- **AND** the Activer action is replaced by Annuler

### Requirement: Commentaires admin page lists comments
The /admin/commentaires route MUST display: breadcrumb, page header, AdminTable with columns AUTEUR, EXTRAIT, PUBLICATION (parent post title truncated), STATUT (StatusPill), DATE, ACTIONS (Approuver / Masquer / Supprimer).

#### Scenario: Comments listed with parent publication
- **WHEN** a comment row renders
- **THEN** it shows the parent publication title in the PUBLICATION column

### Requirement: Signalements admin page lists reports
The /admin/signalements route MUST display: breadcrumb, page header with "2 signalements ouverts" alert pill, vertical list of ReportCard components. Each ReportCard MUST show severity tag, status tag, subject, reporter, reason (in italic quotes), and Examiner/Résoudre/Classer action buttons. Open reports MUST show all 3 actions; resolved/closed MUST show "Traité" placeholder.

#### Scenario: Resolve action updates status
- **WHEN** admin clicks Résoudre on an open report
- **THEN** the report's status changes to "Résolu"
- **AND** the action buttons are replaced by "Traité" placeholder

### Requirement: AdminTable is generic and reusable
The AdminTable component MUST be a TypeScript generic `<T>` accepting a column array and row array. Each column MUST specify a key, header label, and cell renderer. The component MUST render an empty state when the rows array is empty.

#### Scenario: Empty rows show empty state
- **WHEN** AdminTable receives rows = []
- **THEN** it renders an EmptyState component instead of an empty tbody
