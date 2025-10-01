# Scalabilité & Evolutivité

## Pourquoi ?
Préparer la plateforme à supporter plus de trafic, de contenu et de modules métier.

## Comment ?
- **Front** :
  - Utiliser les collections Astro pour gérer facilement multi-langues.
  - Mettre en place le découpage par îlots React lazy-loaded.
- **Back** :
  - Supabase RLS + Policies pour multi-tenancy.
  - Edge Functions pour orchestrer la génération de previews (webhooks GitHub → rebuild Astro).
- **Infra** :
  - Activer Cluster Autoscaler EKS.
  - Configurer AWS WAF + CloudFront devant le load balancer si trafic important.
  - Ajouter un Redis (Elasticache) pour caching.
- **Data & Observabilité** :
  - Export metrics vers Grafana dashboards (latence, TTFB, Core Web Vitals via SpeedCurve API).
  - Alerting via Slack + PagerDuty (Prometheus Alertmanager).
- **Organisation** :
  - Branching GitFlow ou Trunk-Based selon l’équipe.
  - Roadmap triée par impact (ex: builder un CMS interne, automatiser la traduction, générer des études de cas dynamiques).
