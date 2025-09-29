variable "namespace" {
  type    = string
  default = "web"
}

variable "image_uri" {
  type = string
}

variable "supabase_url" {
  type = string
}

variable "supabase_anon_key" {
  type = string
  sensitive = true
}

resource "kubernetes_namespace" "app" {
  metadata {
    name = var.namespace
  }
}

resource "kubernetes_secret" "supabase" {
  metadata {
    name      = "supabase-secrets"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    url      = var.supabase_url
    anon_key = var.supabase_anon_key
  }
}

resource "kubernetes_deployment" "app" {
  metadata {
    name      = "head-center"
    namespace = var.namespace
    labels = {
      app = "head-center"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "head-center"
      }
    }

    template {
      metadata {
        labels = {
          app = "head-center"
        }
      }

      spec {
        container {
          name  = "head-center"
          image = var.image_uri

          port {
            container_port = 4321
          }

          env {
            name = "PUBLIC_SUPABASE_URL"
            value_from {
              secret_key_ref {
                name = "supabase-secrets"
                key  = "url"
              }
            }
          }

          env {
            name = "PUBLIC_SUPABASE_ANON_KEY"
            value_from {
              secret_key_ref {
                name = "supabase-secrets"
                key  = "anon_key"
              }
            }
          }

          resources {
            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
            requests = {
              cpu    = "250m"
              memory = "256Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/"
              port = 4321
            }
            initial_delay_seconds = 15
            period_seconds        = 30
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "app" {
  metadata {
    name      = "head-center"
    namespace = var.namespace
  }

  spec {
    selector = {
      app = kubernetes_deployment.app.metadata[0].labels.app
    }

    port {
      name       = "http"
      port       = 80
      target_port = 4321
    }

    type = "LoadBalancer"
  }
}
