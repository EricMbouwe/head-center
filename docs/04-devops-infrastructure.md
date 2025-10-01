# CI/CD, Docker, Terraform & Kubernetes

## Pourquoi cette stack ?
- **GitHub Actions** : proche du workflow GitHub natif, facile à intégrer avec ECR.
- **Docker multi-stage** : images légères et reproductibles.
- **Terraform** : Infrastructure as Code traçable et versionnée.
- **Kubernetes (EKS)** : orchestration, auto-scaling, rolling updates.

## Comment
1. **CI/CD**
   - Pipeline `ci.yml` : lint → tests → build → image ECR.
   - Job `docker-staging` (branche `main`) pousse l'image taggée `staging`.
   - Job `docker-production` (tags `v*`) pousse l'image taggée `production`.
   - Branch protection : `main` protégée par CI et review, promotion prod via release tag.
2. **Secrets**
   - GitHub : `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AWS_ECR_REGISTRY`.
   - Kubernetes : `supabase-secrets` géré par Terraform (un namespace par environnement).
3. **Docker**
   - `Dockerfile` multi-stage.
   - `docker build -t head-center .` ; `docker run -p 4321:4321 head-center`.
4. **Terraform**
   - Variables `environments` et `supabase_credentials` décrivent respectivement la config infra et les secrets pour `staging` et `production`.
   - Exemple : `cp terraform/terraform.tfvars.example terraform/staging.tfvars` puis renseigner les valeurs.
   - `infra/scripts/deploy.sh staging terraform/staging.tfvars` pour appliquer uniquement staging (`production` idem, `all` pour tout déployer).
5. **Kubernetes**
   - Terraform module applique `Deployment` + `Service` pour chaque namespace environnement.
   - Monitoring via manifest `k8s/monitoring-stack.yaml` (Helm Charts).
