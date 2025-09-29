output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "repository_url" {
  description = "ECR repository"
  value       = aws_ecr_repository.head_center.repository_url
}

output "application_namespaces" {
  description = "Kubernetes namespace per environment"
  value       = { for env, mod in module.app : env => mod.namespace }
}

output "application_services" {
  description = "Service name per environment"
  value       = { for env, mod in module.app : env => mod.service_name }
}
