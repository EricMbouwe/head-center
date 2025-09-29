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
│   │   └── admin
│   │       └── AdminApp.tsx
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
│   └── content
│       └── blog
│           └── *.md
├── public
├── tests
├── terraform
└── k8s
```

## Couche données & services
- **Markdown** : contenu marketing et blog versionné.
- **Supabase** : table `posts` et stockage des assets (covers). Auth Google pour l’équipe.
- **Supabase Edge Functions** : (à créer) pour synchroniser Markdown ⇆ Postgres si besoin.

## Sécurité
- Auth Supabase + RLS (Row-Level Security).
- Secrets injectés via Kubernetes `Secret` (cf. module Terraform).
- CI/CD protège la branche principale via tests + review obligatoire.

## Environnements
- **Staging** : namespace Kubernetes `web-staging`, image ECR taggée `staging`, réplicas minimaux pour valider les features.
- **Production** : namespace `web-prod`, image taggée `production`, autoscaling géré côté cluster (réplicas initiaux configurables via Terraform).
- **Promotion** : release tag `v*` déclenche le push de l'image production et l'exécution de `deploy.sh production` pour appliquer les manifests dédiés.
