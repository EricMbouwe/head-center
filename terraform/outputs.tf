output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "repository_url" {
  description = "ECR repository"
  value       = aws_ecr_repository.head_center.repository_url
}
