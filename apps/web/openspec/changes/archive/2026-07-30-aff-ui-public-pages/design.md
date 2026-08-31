# Design — aff-ui-public-pages

## Routes créées

| Route | Fichier | Source mock | Composants principaux |
|---|---|---|---|
| `/` (Accueil enrichi) | `app/(public)/page.tsx` | `dashboard` (live count), `programme` (next event) | StatCard ×4, Countdown, disciplines, sponsors strip, next-event banner |
| `/actualites` | `app/(public)/actualites/page.tsx` | nouveau `feed` étendu | PageHeader + List de cartes post avec Tag (ANNONCE/RECORD/PARTENARIAT/HOT) + filter row |
| `/masterclass` | `app/(public)/masterclass/page.tsx` | `masterclasses` | PageHeader + grille MasterclassLiveCard (large) |
| `/masterclass/[id]/live` | `app/(public)/masterclass/[id]/live/page.tsx` | `masterclasses` + nouveau mock `participants` | Layout 3-col : sidebar sessions, centre (avatar + reactions + actions), droite participants |
| `/feed` | `app/(public)/feed/page.tsx` | `feed` + communautes | Layout 3-col : sidebar filtres (chips par communauté + counts), centre PostCard feed, droite Tendances + Membres actifs |
| `/programme` | `app/(public)/programme/page.tsx` | `programme` | PageHeader + Tabs (Samedi/Dimanche) + TimelineEvent liste |
| `/awards` | `app/(public)/awards/page.tsx` | `awards` | PageHeader + 4 StatCard + FeatureCard Grand Prix + CategorySection par section + CTA banner final |
| `/profil` | `app/(public)/profil/page.tsx` | nouveau `profil` | Header (avatar + role + stats inline) + Badge card (border gold) + 5 QuickLink cards + Stats row |
| `/profil/candidatures` | `app/(public)/profil/candidatures/page.tsx` | `awards` filtré | Liste de CategoryCard filtrée sur status="candidated" |
| `/profil/programme` | `app/(public)/profil/programme/page.tsx` | `programme` | Liste TimelineEvent filtrée sur favorites |
| `/profil/reseau` | `app/(public)/profil/reseau/page.tsx` | nouveau `network` | Grille de UserCard |
| `/profil/portfolio` | `app/(public)/profil/portfolio/page.tsx` | nouveau `portfolio` | Grille de ProjectCard (mock) |
| `/profil/parametres` | `app/(public)/profil/parametres/page.tsx` | — | Form settings (sections : Profil, Notifications, Sécurité, Confidentialité) |
| `/messages` | `app/(public)/messages/page.tsx` | `messages` | Layout 2-col : ConversationItem list + conversation active (ChatBubble + ChatInputBar) |

## Nouveaux composants domaine (8)

| Composant | Rôle | Notes |
|---|---|---|
| `LiveIndicator` | Pastille rouge + "En direct" clignotante | Réutilisée dans masterclass live, feed live, sidebar |
| `MasterclassLiveCard` | Carte masterclass grande variante | Header communauté tag + statut + expert + time + ProgressBar |
| `ParticipantItem` | Item participant avec avatar + nom + role pill + drapeau + micro toggle | Utilisé colonne droite masterclass live + messages |
| `ReactionButton` | Pill arrondie emoji + count cliquable | Optimistic toggle local state |
| `ChatInputBar` | Input message avec attach + emoji + send | Submit on Enter |
| `FilterChip` | Chip cliquable avec dot couleur + label + count | Variante active = bg-gold-soft text-gold |
| `CategorySection` | Wrapper section : eyebrow uppercase + grille 1-2 col de CategoryCard | Réutilisé N fois sur /awards |
| `ProgressBar` | Barre de progression fine avec variante couleur (default/red) | Utilisée pour capacity masterclass |

## Nouveaux mocks + services

- `mock/participants.ts` + `services/participants.ts` — pour masterclass live
- `mock/network.ts` + `services/network.ts` — pour /profil/reseau
- `mock/portfolio.ts` + `services/portfolio.ts` — pour /profil/portfolio
- Extension de `services/awards.ts` : `getMyCandidatures()`

## États loading / empty

Toutes les pages Server Component qui appellent un service :
- Pendant les 200–500ms de latence simulée : render initial = contenu factice léger (skeleton text)
- Empty : EmptyState component (icône + message "Aucune actualité pour l'instant")

## Responsive

- `/masterclass/[id]/live` : < lg sidebar sessions collapsée en drawer, ≥ lg 3 colonnes
- `/feed` : < lg 1 colonne, ≥ lg sidebar fixe + feed, ≥ xl sidebar droite visible
- `/programme` : Tabs wrap, cards pleine largeur
- `/profil/*` : grilles 2 col ≥ md, 1 col < md

## Vérification

- `npm run lint` → 0 erreur
- `npm run typecheck` → 0 erreur
- `npm run build` → 0 erreur, 13+ routes statiques
- Runtime : `curl /`, `/actualites`, `/masterclass`, `/feed`, `/programme`, `/awards`, `/profil`, `/messages` → HTTP 200

## Réutilisation des composants du change précédent

Tous les écrans s'appuient **exclusivement** sur les composants déjà livrés :
- UI : Button, IconButton, Input, SearchInput, Select, Modal, Card, Tag, StatusPill, Avatar, Tabs
- Layout : Sidebar, Topbar, PageHeader, Breadcrumb, MobileNav
- Métier : StatCard, KPICard, FeatureCard, CategoryCard, PostCard, ConversationItem, ChatBubble, TimelineEvent, ReportCard, ActivityItem, Countdown, NotificationIconButton
