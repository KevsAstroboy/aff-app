# Design — aff-ui-admin-pages

## Routes créées

| Route | Source service | Pattern de page |
|---|---|---|
| `/admin/utilisateurs` | `users` | AdminTable avec Avatar + Email + Communauté + Rôle + StatusPill + Date + actions (Voir / Suspendre / Valider / Delete) + SearchInput + Select filtre statut |
| `/admin/communautes` | `communautes` | Grille 3-col de cartes communauté (avatar + name + status + description + counts + Désactiver/Activer) + SearchInput + Bouton "Nouvelle communauté" |
| `/admin/publications` | `publications` | AdminTable : Auteur + Communauté + Extrait + StatusPill + Réactions + Comments + actions (Voir / Valider / Rejeter / Delete) + SearchInput + Select filtre |
| `/admin/masterclasses` | `masterclasses` | AdminTable : Titre (avec durée) + Expert + Communauté + Date + ProgressBar (participants/capacity) + StatusPill + actions (Voir / Activer / Annuler / Delete) + bouton "Nouvelle masterclass" |
| `/admin/commentaires` | `comments` (nouveau) | AdminTable : Auteur + Extrait + Publication parente + StatusPill + Date + actions (Approuver / Masquer / Supprimer) |
| `/admin/signalements` | `signalements` | Liste verticale de ReportCard (déjà existant) + filter row par severity/status |

## Composant AdminTable

Générique avec signature :

```tsx
type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
};

type AdminTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
  empty?: ReactNode;
};
```

Rend un `<table>` responsive (overflow-x-auto) avec :
- Header uppercase tracked eyebrow
- Row hover bg-white/5
- Action column à droite, sticky si possible

## Mock + service comments

- `mock/comments.ts` : 8 commentaires mockés liés aux publications existantes
- `services/comments.ts` : `getComments`, `approveComment`, `hideComment`, `deleteComment`

## Vérification

- `npm run lint` → 0
- `npm run typecheck` → 0
- `npm run build` → 6 routes admin supplémentaires générées
