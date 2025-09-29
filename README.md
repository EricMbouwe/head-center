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
- Secrets requis : `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AWS_ECR_REGISTRY`.

## Infrastructure
1. Configurer un bucket S3 pour l’état Terraform.
2. `terraform init -backend-config="bucket=..."`
3. `terraform apply -var='supabase_url=...' -var='supabase_anon_key=...'`
4. `infra/scripts/deploy.sh` pour automatiser la mise en prod.

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
