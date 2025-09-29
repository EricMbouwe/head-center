#!/usr/bin/env bash
set -euo pipefail

if ! command -v aws >/dev/null; then
  echo "AWS CLI is required" >&2
  exit 1
fi

if ! command -v terraform >/dev/null; then
  echo "Terraform is required" >&2
  exit 1
fi

if ! command -v kubectl >/dev/null; then
  echo "kubectl is required" >&2
  exit 1
fi

aws eks update-kubeconfig --name "$EKS_CLUSTER_NAME" --region "$AWS_REGION"

echo "Running Terraform apply..."
terraform -chdir=terraform init -input=false
terraform -chdir=terraform apply -input=false -auto-approve

echo "Deploying monitoring stack..."
kubectl apply -f k8s/monitoring-stack.yaml

echo "Deployment complete."
