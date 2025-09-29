# Stratégie de tests TDD/BDD

## Pourquoi ?
Garantir la qualité, la sécurité des régressions et documenter le comportement.

## Comment ?
1. **Unitaires (Vitest)** : composants React (Hero, AdminApp) et utilitaires Astro.
2. **Intégration (Vitest + Astro)** : collections Markdown, interactions Supabase mockées.
3. **E2E (Playwright)** : parcours critique (landing, blog, login admin).
4. **Tests contractuels** : utiliser Supabase Triggers/Edge Functions (mock via `msw`).
5. **Couverture** : objectif ≥ 90% statements, branches critiques couvertes.

## BDD
- Rédiger des scénarios Gherkin pour les features de l’admin (création article, publication).
- Utiliser Playwright Test (fixtures) pour traduire ces scénarios.

## Automatisation
- `npm run test` : unitaires + intégration.
- `npm run test:e2e` : parcours UI.
- `ci.yml` orchestre lint + tests + build.
