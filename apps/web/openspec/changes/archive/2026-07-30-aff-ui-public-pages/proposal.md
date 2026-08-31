# Aff-UI Public Pages

## Why

Le système de design et la coquille de mise en page sont livrés (`aff-ui-shell-and-design-system` archivé). Les utilisateurs visitent l'application via les **pages publiques** : Accueil hero, Actualités, Masterclass (liste + live), Feed communautaire, Programme, Awards, Profil + sub-pages, Messages. Sans ces pages, l'application n'a aucune valeur utilisateur.

Ce change implémente toutes les surfaces publiques consommant exclusivement les composants livrés et la façade `services/` déjà en place.

## What changes

- 13 routes publiques sous `app/(public)/` couvrant l'intégralité des designs
- 8 nouveaux composants domaine réutilisables (LiveIndicator, ParticipantItem, ReactionButton, ChatInputBar, FilterChip, CategorySection, ProgressBar, MasterclassLiveCard)
- Une route dynamique `/masterclass/[id]/live` pour la vue live 3-col

## Out of scope

- Pages admin → change `aff-ui-admin-pages` suivant
- Auth réelle, backend, i18n (inchangé)
- Tests E2E

## Defaults (hérités du change précédent, inchangés)

Next 15 · TS strict · Tailwind v3 · Inter · Zustand · Framer Motion · FR en dur · façade services async.

## Impact

- **Nouveau** : 13 routes, 8 composants domaine
- **Modifié** : aucun fichier du change précédent n'est touché (coquille stable)
- **Supprimé** : aucun

## Non-goals

- Pas d'auth
- Pas d'i18n
- Pas de backend réel
- Pas de page admin dans ce change
