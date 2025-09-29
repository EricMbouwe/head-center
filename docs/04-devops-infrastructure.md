# CI/CD, Docker, Terraform & Kubernetes

## Pourquoi cette stack ?
- **GitHub Actions** : proche du workflow GitHub natif, facile à intégrer avec ECR.
- **Docker multi-stage** : images légères et reproductibles.
- **Terraform** : Infrastructure as Code traçable et versionnée.
- **Kubernetes (EKS)** : orchestration, auto-scaling, rolling updates.

## Comment
1. **CI/CD**
   - Pipeline `ci.yml` : lint → tests → build → image ECR.
   - Branch protection : `main` protégée par CI et review.
2. **Secrets**
   - GitHub : `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
   - Kubernetes : `supabase-secrets` (Terraform module).
3. **Docker**
   - `Dockerfile` multi-stage.
   - `docker build -t head-center .` ; `docker run -p 4321:4321 head-center`.
4. **Terraform**
   - `terraform init -backend-config="bucket=..."`.
   - `terraform apply -var='supabase_url=...' -var='supabase_anon_key=...'`.
5. **Kubernetes**
   - Terraform module applique `Deployment` + `Service`.
   - Monitoring via manifest `k8s/monitoring-stack.yaml` (Helm Charts).
