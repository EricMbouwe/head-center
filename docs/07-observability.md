# Observabilité & Alerting

## Pourquoi ?
Détecter rapidement les dégradations de performance, incidents ou erreurs utilisateur.

## Comment ?
1. **Prometheus** : collecte des métriques Kubernetes (CPU, mémoire, latence HTTP).
2. **Grafana** : dashboards (Landing performance, Taux de conversion, Temps de build CI).
3. **Alertmanager** : règles (latence > 500ms, erreurs 5xx > 1%). Notifications Slack.
4. **Elastic Stack (ELK)** : logs applicatifs via Filebeat.
5. **OpenTelemetry** : instrumentation côté Astro/React (utiliser `@opentelemetry/api`, exporter vers Grafana Tempo si besoin).
6. **Supabase** : activer logs + audit trails.

## Bonnes pratiques
- Centraliser les dashboards dans Grafana (folder "Head Center").
- Tags par environnement (`env=staging|prod`).
- Mettre des SLO (99.9% uptime, TTFB < 200ms).

## Déploiement
- Définir `GRAFANA_ADMIN_PASSWORD` avant d'appliquer `k8s/monitoring-stack.yaml` (ex: `export GRAFANA_ADMIN_PASSWORD=$(openssl rand -base64 16)`).
- `kubectl apply -f k8s/monitoring-stack.yaml`
