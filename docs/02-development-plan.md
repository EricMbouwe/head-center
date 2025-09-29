# Plan de Développement Étape par Étape

Chaque étape est précédée d’une explication claire du **pourquoi** et du **comment**.

1. **Initialisation du repo**
   - *Pourquoi ?* Obtenir une base saine versionnée.
   - *Comment ?* `npm install`, `git init`, configuration de Husky (optionnel) et commit initial.
2. **Scaffolding Astro**
   - *Pourquoi ?* Disposer des pages marketing/portfolio/blog dès le départ.
   - *Comment ?* Utiliser le template livré (`src/pages`, `src/components`, `tailwind.config`).
3. **Intégration Supabase**
   - *Pourquoi ?* Centraliser l’auth et les données pour l’admin.
   - *Comment ?* Créer un projet Supabase, configurer les variables `PUBLIC_SUPABASE_URL` et `PUBLIC_SUPABASE_ANON_KEY`, activer OAuth Google, créer la table `posts`.
4. **TDD/BDD**
   - *Pourquoi ?* Sécuriser les features et faciliter la refactorisation.
   - *Comment ?* Écrire les tests unitaires (Hero), d’intégration (collection blog) puis E2E (Playwright) avant d’implémenter les features.
5. **CI/CD GitHub Actions**
   - *Pourquoi ?* Garantir la qualité et l’automatisation du build.
   - *Comment ?* Configurer les secrets GitHub (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AWS_ACCESS_KEY_ID`, etc.), exécuter le workflow `ci.yml`.
6. **Containerisation & Publication ECR**
   - *Pourquoi ?* Standardiser l’exécution et préparer Kubernetes.
   - *Comment ?* Builder l’image via GitHub Actions et la pousser sur ECR.
7. **Provisioning AWS via Terraform**
   - *Pourquoi ?* Automatiser VPC, EKS, ECR, DNS.
   - *Comment ?* `terraform init`, `terraform apply` avec variables `state_bucket`, `supabase_url`, `supabase_anon_key`.
8. **Déploiement Kubernetes**
   - *Pourquoi ?* Orchestrer l’application en production.
   - *Comment ?* `kubectl apply -f k8s/monitoring-stack.yaml`, Terraform module `app` applique le déploiement.
9. **Observabilité**
   - *Pourquoi ?* Suivre les performances et anticiper les incidents.
   - *Comment ?* Installer kube-prometheus-stack, Grafana, Elastic/Filebeat; configurer les dashboards et alertes (cf. `docs/07-observability.md`).
10. **Itérations futures**
    - *Pourquoi ?* Evolutivité continue (nouveaux modules, SEO, internationalisation).
    - *Comment ?* Utiliser la roadmap fournie dans `docs/06-scalability-guide.md`.
