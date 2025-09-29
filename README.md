# Head Center — Blueprint d'agence web Astro/React

## Objectifs
- Présenter un site vitrine professionnel avec portfolio et blog.
- Fournir une console admin (React + Supabase) pour gérer les contenus.
- Automatiser tout le cycle de vie (tests, CI/CD, Docker, Terraform, Kubernetes, Observabilité).

## Structure
- `src/` : pages Astro, composants React, contenu Markdown.
- `tests/` : unitaires (Vitest), intégration (Vitest + Astro), e2e (Playwright).
- `terraform/` : provisioning AWS (VPC, EKS, ECR, DNS, déploiement applicatif).
- `k8s/` : manifestes observabilité (Prometheus, Grafana, ELK).
- `docs/` : guides pédagogiques (architecture, plan de dev, style, scalabilité).

## Démarrage local
```bash
npm install
npm run dev
```
Variables à définir dans `.env` :
```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
```

## Tests
```bash
npm run lint
npm run test       # unitaires + intégration
npm run test:e2e   # e2e (nécessite `npm run dev` dans un autre terminal)
```

## Build & Docker
```bash
npm run build
docker build -t head-center .
docker run -p 4321:4321 head-center
```

## CI/CD
- Workflow GitHub Actions : `.github/workflows/ci.yml`.
- Pipelines différenciées :
  - `docker-staging` se déclenche sur `main` et publie l'image `:staging`.
  - `docker-production` se déclenche sur un tag `v*` et publie l'image `:production`.
- Secrets requis : `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AWS_ECR_REGISTRY`.

## Infrastructure
1. Configurer un bucket S3 pour l’état Terraform.
2. Copier `terraform/terraform.tfvars.example` vers `terraform/staging.tfvars` et `terraform/production.tfvars` en renseignant vos URLs/clefs Supabase et, si besoin, un `state_key_suffix` distinct.
3. Initialiser l'état : `terraform init` (le backend S3 est déjà défini via variables `state_bucket` et `state_key_suffix`).
4. Déployer en staging :
   ```bash
   infra/scripts/deploy.sh staging terraform/staging.tfvars
   ```
5. Promouvoir en production :
   ```bash
   infra/scripts/deploy.sh production terraform/production.tfvars
   ```
6. Pour déployer simultanément toutes les stacks (en fournissant un unique fichier `.tfvars` qui contient les deux environnements) :
   ```bash
   infra/scripts/deploy.sh all terraform/terraform.tfvars
   ```

## Observabilité
- Monitoring stack installée via `k8s/monitoring-stack.yaml` (kube-prometheus-stack + ELK).
- Dashboards Grafana à créer (latence, conversion, erreurs).

## Documentation
Consulter le dossier `docs/` pour :
- Vision, architecture, plan de développement.
- Stratégie de tests, DevOps, charte graphique.
- Scalabilité, observabilité.

## Roadmap suggérée
- Créer le modèle Supabase `posts` + politiques RLS.
- Ajouter les Edge Functions pour synchroniser Markdown ↔ Supabase.
- Internationaliser le contenu (Astro collections par locale).
- Intégrer un générateur de rapports (PDF) pour les études de cas.
