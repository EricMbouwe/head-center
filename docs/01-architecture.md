# Architecture Applicative

## Explication pédagogique
**Pourquoi ?** Séparer clairement les responsabilités permet d’itérer vite (front marketing, blog markdown, back-office React).
**Comment ?** En combinant le meilleur d’Astro (pages statiques) et de React (îlots dynamiques) et en s’appuyant sur Supabase pour tout l’aspect data.

## Structure
```
.
├── src
│   ├── components
│   │   ├── Hero.tsx
│   │   ├── providers
│   │   │   ├── NotificationProvider.tsx
│   │   │   └── QueryProvider.tsx
│   │   ├── blog
│   │   │   └── BlogView.tsx
│   │   └── admin
│   │       ├── AdminApp.tsx
│   │       └── PostForm.tsx
│   ├── layouts
│   │   └── BaseLayout.astro
│   ├── pages
│   │   ├── index.astro
│   │   ├── portfolio.astro
│   │   ├── blog
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── admin
│   │       └── index.astro
│   ├── content
│   │   └── blog
│   │       └── *.md
│   └── store
│       └── blogStore.ts
├── public
├── tests
├── terraform
└── k8s
```

## Couche données & services
- **Markdown** : contenu marketing et blog versionné.
- **Supabase** : table `posts` et stockage des assets (covers). Auth Google pour l’équipe.
- **Supabase Edge Functions** : (à créer) pour synchroniser Markdown ⇆ Postgres si besoin.

## Gestion d'état côté client
- **Zustand** : magasin léger `useBlogStore` pour centraliser la recherche, les filtres par catégorie/tag et préparer les futures
  interactions multi-pages sans basculer vers un framework plus lourd.
- **Notifications globales** : contexte `NotificationProvider` adossé à `react-hot-toast` pour propager des toasts succès/erreur/
  info cohérents sur toutes les îles React (admin, formulaires futurs) sans répéter la logique d'affichage.

## Sécurité
- Auth Supabase + RLS (Row-Level Security).
- Secrets injectés via Kubernetes `Secret` (cf. module Terraform).
- CI/CD protège la branche principale via tests + review obligatoire.

## Environnements
- **Staging** : namespace Kubernetes `web-staging`, image ECR taggée `staging`, réplicas minimaux pour valider les features.
- **Production** : namespace `web-prod`, image taggée `production`, autoscaling géré côté cluster (réplicas initiaux configurables via Terraform).
- **Promotion** : release tag `v*` déclenche le push de l'image production et l'exécution de `deploy.sh production` pour appliquer les manifests dédiés.
