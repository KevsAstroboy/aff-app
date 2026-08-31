# Design — aff-ui-shell-and-design-system

## Architecture du projet

```
aff-ui/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx              # Coquille publique (Sidebar + Topbar)
│   │   └── page.tsx                # Démo : StatCard grid + Countdown + disciplines
│   ├── admin/
│   │   ├── layout.tsx              # Coquille admin (sidebar foncée + "Accès administrateur")
│   │   └── tableau-de-bord/
│   │       └── page.tsx            # Démo : 4 KPIs + activité + top communautés
│   ├── layout.tsx                  # Racine html/body + font + providers
│   └── globals.css                 # Tailwind + variables CSS
├── components/
│   ├── ui/                         # Button, IconButton, Input, SearchInput, Select,
│   │                               # Modal, Card, Tag, StatusPill, Avatar, Tabs
│   ├── layout/                     # Sidebar, Topbar, PageHeader, Breadcrumb, MobileNav
│   └── domain/                     # StatCard, KPICard, FeatureCard, CategoryCard,
│                                   # PostCard, ConversationItem, ChatBubble,
│                                   # TimelineEvent, ReportCard, ActivityItem,
│                                   # Countdown, NotificationIconButton
├── services/                       # Façade async : users, masterclasses, communautes,
│                                   # publications, feed, programme, awards,
│                                   # signalements, messages, dashboard
├── mock/                           # Données TS brutes consommées par services
├── types/                          # Types de domaine (User, Masterclass, Post, etc.)
├── lib/                            # cn(), formatters (date, nombre), drapeaux emoji
├── constants/                      # NAV_ITEMS, COMMUNAUTES (carte couleurs), DISCIPLINES
├── hooks/                          # useCountdown, useDebounce
└── stores/                         # modal.ts, current-user.ts (Zustand)
```

## Design tokens

```ts
// tailwind.config.ts — palette sémantique
colors: {
  bg:              '#000000',
  surface:         '#0F0F0F',  // cartes
  'surface-raised':'#141414',  // cartes imbriquées / inputs
  border:          '#1F1F1F',
  'border-strong': '#262626',
  text:            '#F5F5F5',
  'text-muted':    '#8A8A8A',
  'text-subtle':   '#5C5C5C',
  gold:            '#E8B26F',  // accent
  'gold-hover':    '#D49A4F',
  'gold-soft':     'rgba(232,178,111,0.12)',  // fond badge / nav active
  'live-red':      '#EF4444',
  success:         '#10B981',
  warn:            '#F59E0B',
  purple:          '#A855F7',  // tag CINÉMA, RECORDS
  domain: {
    art:           '#F472B6',  // rose
    musique:       '#E8B26F',  // or
    cinema:        '#A855F7',  // violet
    mode:          '#34D399',  // émeraude
    danse:         '#22D3EE',  // cyan
    litterature:   '#FBBF24',  // ambre
  },
}

borderRadius: { sm:8, md:12, lg:16, xl:20, '2xl':24 }

fontFamily: { sans:['Inter','system-ui','sans-serif'] }

fontSize: {
  display:   ['4.5rem',{lineHeight:'1.05',letterSpacing:'-0.02em',fontWeight:'800'}],
  h1:        ['3rem',  {lineHeight:'1.1',  letterSpacing:'-0.02em',fontWeight:'700'}],
  h2:        ['1.875rem',{lineHeight:'1.2',letterSpacing:'-0.01em',fontWeight:'600'}],
  h3:        ['1.25rem',{lineHeight:'1.3', fontWeight:'600'}],
  body:      ['1rem',  {lineHeight:'1.5'}],
  small:     ['0.875rem',{lineHeight:'1.5'}],
  eyebrow:   ['0.75rem',{lineHeight:'1',    letterSpacing:'0.18em',fontWeight:'600'}],
}
```

Conventions d'usage :
- Les composants référencent **uniquement** les tokens sémantiques (`bg-surface`, `text-gold`, `border-default`)
- Pas de hex brut, pas d'ombre "glassmorphism" — la profondeur vient des bordures 1px subtiles
- StatCard/Countdown utilisent `font-variant-numeric: tabular-nums`

## Coquille de mise en page

### Publique (`app/(public)/layout.tsx`)

```
┌──────────┬───────────────────────────────────────────────┐
│          │ ┌─Topbar──────────────────────────────────┐  │
│ Sidebar  │ │ Title · Breadcrumb · [notif][notif][avatar]│
│ 256px    │ └─────────────────────────────────────────┘  │
│          │ ┌─Main──────────────────────────────────────┐ │
│ fixed    │ │                                            │ │
│          │ │                                            │ │
│          │ │                                            │ │
└──────────┴──────────────────────────────────────────────┘
```

- Sidebar fixe 256px ≥ md, drawer < md
- Topbar fixe 80px, fond `bg`, bordure basse `border`
- Sidebar contient : logo AFF (cercle or), nav principale (Accueil, Masterclass, Feed, Programme, Awards, Messages, Profil), séparateur, "Administration" lien, bouton primaire "S'inscrire" pleine largeur en bas

### Admin (`app/admin/layout.tsx`)

Identique structure, mais :
- Sidebar fond légèrement plus foncé (`bg-surface`)
- Pill rouge "Accès administrateur" sous le logo
- Section heading `NAVIGATION` en majuscule tracké
- Badge rouge numérique sur items avec compteur en attente (ex. `Signalements 2`)
- Lien "Retour à l'application" en bas de sidebar avant le profil utilisateur

## Système de composants

### Primitives UI (11)

| Composant | Variantes | Notes |
|---|---|---|
| `Button` | primary / ghost / outline / danger-outline / success-outline · sm / md / lg | Primary = fond gold, texte noir ; Outline = bordure gold transparent |
| `IconButton` | ghost / outline · sm / md | Toujours `aria-label` requis |
| `Input` | défaut / erreur / désactivé | Fond `surface-raised`, bordure `border`, focus ring `gold-soft` |
| `SearchInput` | défaut | Input + icône loupe à gauche |
| `Select` | défaut | Wrapper autour de `<select>` natif stylé |
| `Modal` | sm / md / lg · overlay sombre | Fond carte, fermeture ESC + clic overlay |
| `Card` | default / bordered / featured (bordure gold) | Padding 24, radius `2xl` |
| `Tag` | color map (cinéma → violet, musique → gold, etc.) | Pill arrondie, fond `*-soft`, texte couleur |
| `StatusPill` | map status → {couleur, label} | Config centralisée (`lib/status-config.ts`) |
| `Avatar` | sm / md / lg · avec/sans drapeau | Initiales 2 lettres, fond coloré déterministe |
| `Tabs` | underline / pill | Pill vu dans Programme |

### Métier (12)

| Composant | Rôle |
|---|---|
| `StatCard` | KPI générique (icône + grand nombre + label + delta optionnel) |
| `KPICard` | Variante admin (icône dans carré coloré + delta coloré) |
| `FeatureCard` | Carte "Grand Prix" style (bordure gold + watermark + CTA) |
| `CategoryCard` | Carte catégorie Awards (icône trophée + titre + "Candidater") |
| `PostCard` | Carte post feed (auteur + contenu + réactions emoji + commentaires + partage + bookmark) |
| `ConversationItem` | Item liste conversations (avatar + nom + dernière msg + heure + compteur non-lus) |
| `ChatBubble` | Bulle de message (other = surface-raised, mine = gold plein) |
| `TimelineEvent` | Événement de timeline programme (point + ligne + carte à droite) |
| `ReportCard` | Carte signalement (severity pill + status + actions Examiner/Résoudre/Classer) |
| `ActivityItem` | Item feed activité admin (icône type + message + heure) |
| `Countdown` | Compte à rebours Jours/Hrs/Min/Sec, temps réel via `useCountdown` |
| `NotificationIconButton` | Bouton icône + badge point rouge |

### Layout (5)

- `Sidebar` (variantes : `public` | `admin`)
- `Topbar` (titre région + notifs + avatar)
- `PageHeader` (eyebrow optionnel + H1 + subtitle optionnel)
- `Breadcrumb` (chemin `Admin > Tableau de bord`)
- `MobileNav` (drawer via Modal + sidebar)

## Façade de données

Toutes les pages consomment les services (jamais `mock/` directement). Signature type :

```ts
// services/users.ts
export async function getUsers(filter?: UserFilter): Promise<User[]>;
export async function getUser(id: string): Promise<User>;
export async function suspendUser(id: string): Promise<void>;
```

Chaque service :
- Type les entrées/sorties (`types/index.ts`)
- Simule une latence 200–500ms via `await sleep()`
- Retourne des tableaux (vide si pas de données) → l'UI gère l'`EmptyState`

Services à implémenter (9) :
`dashboard`, `users`, `communautes`, `publications`, `masterclasses`, `feed`, `programme`, `awards`, `signalements`, `messages`

## Stores Zustand

```ts
// stores/modal.ts
type ModalStore = {
  inscriptionOpen: boolean;
  openInscription: () => void;
  closeInscription: () => void;
};

// stores/current-user.ts
type UserStore = {
  user: CurrentUser;
  setUser: (u: CurrentUser) => void;
};
```

## Accessibilité

- Tous les éléments interactifs ont un focus ring visible (`ring-2 ring-gold-soft`)
- Boutons icône-only portent un `aria-label`
- Contraste WCAG AA respecté (texte principal ≥ 4.5:1)
- Navigation clavier complète (Tab, Shift+Tab, Enter, Esc pour fermer Modal)
- Sémantique HTML5 (`<nav>`, `<main>`, `<aside>`, `<header>`)

## Responsive

| Breakpoint | Sidebar | Grilles | Topbar |
|---|---|---|---|
| `< 640px` (sm) | Drawer (hamburger) | 1 colonne | Compact (icônes seulement) |
| `≥ 640px` (sm) | Drawer | 2 colonnes | Compact |
| `≥ 768px` (md) | Fixe 256px | 2 colonnes | Complet |
| `≥ 1024px` (lg) | Fixe 256px | 3 colonnes | Complet |
| `≥ 1280px` (xl) | Fixe 256px | 4 colonnes | Complet |

## Dépendances

```
next@^15            react@^19         react-dom@^19
typescript@^5       @types/node       @types/react       @types/react-dom
tailwindcss@^3      postcss           autoprefixer
framer-motion@^11   lucide-react@^0.4
zustand@^5          clsx             tailwind-merge
eslint@^9           eslint-config-next prettier
```

## Vérifications

- `npm run lint` — passe sans warning
- `npm run typecheck` — 0 erreur TS strict
- Vérification manuelle : ouverture aux 5 breakpoints (DevTools), navigation clavier, focus ring visible
