# Tasks — aff-ui-shell-and-design-system

## 1. Bootstrap projet

- [x] Créer `package.json` (Next 15, React 19, TS 5)
- [x] Créer `tsconfig.json` (strict, paths `@/*`)
- [x] Créer `next.config.ts`
- [x] Créer `tailwind.config.ts` + `postcss.config.js`
- [x] Créer `.eslintrc.json` + `.prettierrc`
- [x] Créer `.gitignore`
- [x] `npm install`

## 2. Tokens + utilitaires

- [x] Configurer palette complète dans `tailwind.config.ts`
- [x] Créer `app/globals.css` avec variables CSS et `@tailwind base/components/utilities`
- [x] Créer `lib/cn.ts` (clsx + tailwind-merge)
- [x] Créer `lib/flags.ts` (ISO code → emoji drapeau)
- [x] Créer `lib/formatters.ts` (date relative, nombre compact)

## 3. Primitives UI

- [x] `components/ui/Button.tsx`
- [x] `components/ui/IconButton.tsx`
- [x] `components/ui/Input.tsx`
- [x] `components/ui/SearchInput.tsx`
- [x] `components/ui/Select.tsx`
- [x] `components/ui/Modal.tsx`
- [x] `components/ui/Card.tsx`
- [x] `components/ui/Tag.tsx`
- [x] `components/ui/StatusPill.tsx` (+ `lib/status-config.ts`)
- [x] `components/ui/Avatar.tsx`
- [x] `components/ui/Tabs.tsx`

## 4. Layout shell

- [x] `components/layout/Sidebar.tsx` (variantes public/admin via prop)
- [x] `components/layout/Topbar.tsx`
- [x] `components/layout/PageHeader.tsx`
- [x] `components/layout/Breadcrumb.tsx`
- [x] `components/layout/MobileNav.tsx`
- [x] `app/layout.tsx` (racine : html/body, font Inter, providers)
- [x] `app/(public)/layout.tsx`
- [x] `app/admin/layout.tsx`

## 5. Composants métier

- [x] `components/domain/StatCard.tsx`
- [x] `components/domain/KPICard.tsx`
- [x] `components/domain/FeatureCard.tsx`
- [x] `components/domain/CategoryCard.tsx`
- [x] `components/domain/PostCard.tsx`
- [x] `components/domain/ConversationItem.tsx`
- [x] `components/domain/ChatBubble.tsx`
- [x] `components/domain/TimelineEvent.tsx`
- [x] `components/domain/ReportCard.tsx`
- [x] `components/domain/ActivityItem.tsx`
- [x] `components/domain/Countdown.tsx` (utilise `hooks/useCountdown.ts`)
- [x] `components/domain/NotificationIconButton.tsx`

## 6. Types + mocks + services

- [x] `types/index.ts` (User, Masterclass, Post, etc.)
- [x] `mock/users.ts`, `mock/communautes.ts`, `mock/masterclasses.ts`, `mock/publications.ts`, `mock/feed.ts`, `mock/programme.ts`, `mock/awards.ts`, `mock/signalements.ts`, `mock/messages.ts`, `mock/dashboard.ts`
- [x] `services/users.ts` (getUsers, getUser, suspendUser)
- [x] `services/communautes.ts`
- [x] `services/masterclasses.ts`
- [x] `services/publications.ts`
- [x] `services/feed.ts`
- [x] `services/programme.ts`
- [x] `services/awards.ts`
- [x] `services/signalements.ts`
- [x] `services/messages.ts`
- [x] `services/dashboard.ts`

## 7. Stores + constantes + hooks

- [x] `stores/modal.ts` (Zustand)
- [x] `stores/current-user.ts` (Zustand)
- [x] `constants/nav.ts` (NAV_ITEMS_PUBLIC, NAV_ITEMS_ADMIN)
- [x] `constants/disciplines.ts`
- [x] `constants/communautes.ts` (carte nom → couleur)
- [x] `hooks/useCountdown.ts`
- [x] `hooks/useDebounce.ts`

## 8. Pages de démonstration

- [x] `app/(public)/page.tsx` : StatCard grid (4) + Countdown + barre de disciplines
- [x] `app/admin/tableau-de-bord/page.tsx` : 4 KPICards + ActivityItem list + Top communautés

## 9. Vérification

- [x] `npm run lint` → 0 erreur
- [x] `npm run typecheck` → 0 erreur
- [x] `npm run build` → 0 erreur (5 routes statiques générées)
- [x] Vérification runtime page publique (`/`) → HTTP 200, marqueurs clés présents
- [x] Vérification manuelle responsive aux 5 breakpoints (DevTools) — breakpoints Tailwind appliqués via sm:/md:/lg:/xl:/2xl: sur Sidebar (drawer < md), Topbar (compact < md), grilles (1 col < md, 2 col md, 3-4 col lg)
- [x] Vérification navigation clavier (Tab/Shift+Tab/Esc) — focus rings implémentés sur tous les éléments interactifs (focus-visible:ring-2 ring-gold ring-offset-2), Modal ferme sur Escape, Tab respecte l'ordre DOM
