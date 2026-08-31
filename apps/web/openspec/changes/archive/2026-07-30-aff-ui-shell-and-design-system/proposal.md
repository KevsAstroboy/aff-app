# Aff-UI Shell & Design System

## Why

22 surfaces de design (public + admin) pour l'Africa Future Festival 2026 existent dans `design/`, mais **zéro code**. Chaque écran partage les mêmes patterns (sidebar, topbar, KPI card, status pill, action buttons, avatar avec drapeau). Construire les écrans sans verrouiller d'abord ces patterns = 22 itérations de dérive stylistique.

Ce change établit le **système de design + coquille de mise en page + façade de données mock** sur lesquels tous les changes de pages ultérieurs viendront se composer.

## What changes

- Nouveau projet Next.js 15 (App Router, TypeScript strict, Tailwind v3, ESLint, Prettier) bootstrappé à la racine de `aff-ui/`
- Design tokens codifiés dans `tailwind.config.ts` + variables CSS (couleurs, espacement, radius, ombres, échelle typographique)
- Coquille de mise en page séparée en deux route groups : `app/(public)/` et `app/admin/`, chacune avec sa variante de sidebar
- ~28 composants réutilisables sous `components/ui/`, `components/layout/` et `components/domain/`
- Façade de données mock sous `services/` (signatures async typées — drop-in pour vrai `fetch` plus tard)
- Types de domaine sous `types/`
- Deux **pages de démonstration** (une publique, une admin) pour valider le système avant que les pages définitives n'arrivent

## Out of scope

- Les 22 pages définitives → changes `aff-ui-public-pages` et `aff-ui-admin-pages`
- Auth/backend réels
- i18n (FR uniquement pour l'instant)
- Tests E2E (Playwright plus tard)

## Defaults

| Question | Choix | Raison |
|---|---|---|
| Version Next | **15** (App Router, React 19, Turbopack dev only) | Défaut courant |
| Tailwind | **v3** | Stabilité, docs plus larges |
| Police | **Inter** | Libre, cohérent avec l'identité visuelle |
| État global | **Zustand** (modal, current-user) ; `useState` sinon | Modale d'inscription déclenchée depuis la sidebar nécessite un état partagé |
| Animations | **Framer Motion** pour stagger/page/modal ; Tailwind pour hover/focus | Skill le mentionne, sensation premium |
| i18n | Aucune, chaînes FR en dur dans TSX | Tout le contenu est FR |
| Données | Façade `services/` retournant `Promise<T>` avec latence simulée 200–500ms | Skill dit "pas de refacto quand le backend arrive" |
| Auth | Pas de login/signup ; utilisateur connecté partout ; modale `Inscription Festival` accessible depuis la sidebar | Cohérent avec les designs |

## Impact

- **Nouveau** : toute la base du projet (config, tokens, coquille, primitives, façade de données)
- **Modifié** : aucun
- **Supprimé** : aucun

## Non-goals

- Pas de backend réel
- Pas d'i18n
- Pas d'auth réelle
- Pas de tests E2E dans ce change
