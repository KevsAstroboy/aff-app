# Tasks — aff-ui-public-pages

## 1. Composants domaine additionnels

- [x] `components/domain/LiveIndicator.tsx`
- [x] `components/domain/MasterclassLiveCard.tsx`
- [x] `components/domain/ParticipantItem.tsx`
- [x] `components/domain/ReactionButton.tsx`
- [x] `components/domain/ChatInputBar.tsx`
- [x] `components/domain/FilterChip.tsx`
- [x] `components/domain/CategorySection.tsx`
- [x] `components/domain/ProgressBar.tsx`
- [x] `components/domain/EmptyState.tsx`
- [x] `components/domain/QuickLinkCard.tsx`
- [x] `components/domain/Skeleton.tsx`

## 2. Mocks + services additionnels

- [x] `mock/participants.ts`
- [x] `services/participants.ts`
- [x] `mock/network.ts`
- [x] `services/network.ts`
- [x] `mock/portfolio.ts`
- [x] `services/portfolio.ts`
- [x] Extension `services/awards.ts` (`getMyCandidatures`)
- [x] Extension `mock/masterclasses.ts` — déjà fourni via session list

## 3. Pages publiques

- [x] Enrichir `app/(public)/page.tsx` (Accueil complet : stats + countdown + disciplines + sponsors + next-event)
- [x] `app/(public)/actualites/page.tsx` (Live Feed avec Tag catégories)
- [x] `app/(public)/masterclass/page.tsx` (Liste filtrable)
- [x] `app/(public)/masterclass/[id]/live/page.tsx` (Vue 3-col)
- [x] `app/(public)/feed/page.tsx` (3-col : filtres + posts + trends + active members)
- [x] `app/(public)/programme/page.tsx` (Timeline avec Tabs jours)
- [x] `app/(public)/awards/page.tsx` (Hero StatCards + FeatureCard + CategorySection + CTA banner)
- [x] `app/(public)/profil/page.tsx` (Header + Badge + QuickLinks + Stats row)
- [x] `app/(public)/profil/candidatures/page.tsx`
- [x] `app/(public)/profil/programme/page.tsx`
- [x] `app/(public)/profil/reseau/page.tsx`
- [x] `app/(public)/profil/portfolio/page.tsx`
- [x] `app/(public)/profil/parametres/page.tsx`
- [x] `app/(public)/messages/page.tsx` (2-pane chat)

## 4. Vérification

- [x] `npm run lint` → 0 erreur
- [x] `npm run typecheck` → 0 erreur
- [x] `npm run build` → 17 routes générées, 0 erreur
- [ ] Runtime check de toutes les routes — à faire manuellement si nécessaire
