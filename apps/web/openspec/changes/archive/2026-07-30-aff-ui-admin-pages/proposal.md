# Aff-UI Admin Pages

## Why

Les utilisateurs publics naviguent déjà via 14 routes livrées dans `aff-ui-public-pages`. Les administrateurs AFF doivent pouvoir modérer les utilisateurs, communautés, publications, masterclasses, commentaires et signalements depuis une section dédiée `/admin`. La coquille admin existe (Sidebar variant + badge compteurs + Topbar) mais aucune page interne n'est implémentée.

Ce change livre les 6 pages admin restantes consommant exclusivement les services façade déjà en place.

## What changes

- 6 routes admin sous `app/admin/` :
  - `/admin/utilisateurs` — data table utilisateurs
  - `/admin/communautes` — grille de cartes communautés
  - `/admin/publications` — data table publications à modérer
  - `/admin/masterclasses` — data table masterclasses
  - `/admin/commentaires` — liste commentaires
  - `/admin/signalements` — cartes de signalements avec severity
- 1 nouveau composant domaine réutilisable : `AdminTable<T>` (wrapper générique colonnes + actions)
- 1 extension mock : `comments` + service
- Hooks : suppression des badges en attente dans la Sidebar admin quand un screen est actif (cosmétique)

## Out of scope

- Login / logout
- Permissions par rôle (admin unique pour ce change)
- E2E tests
- Backend réel

## Defaults (hérités, inchangés)

Next 15 · TS strict · Tailwind v3 · Inter · Zustand · Framer Motion · FR en dur · façade services async.

## Impact

- **Nouveau** : 6 routes, 1 composant `AdminTable`, mock `comments` + service
- **Modifié** : aucun fichier du change précédent n'est touché
- **Supprimé** : aucun

## Non-goals

- Pas d'auth
- Pas d'i18n
- Pas de permissions fines
