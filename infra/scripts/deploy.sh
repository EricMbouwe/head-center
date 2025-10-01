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

ENVIRONMENT=${1:-}

if [[ -z "$ENVIRONMENT" ]]; then
  echo "Usage: $0 <staging|production|all> [tfvars-file]" >&2
  exit 1
fi

TFVARS_FILE=${2:-}
TF_APPLY_ARGS=()

if [[ "$ENVIRONMENT" == "all" ]]; then
  if [[ -z "$TFVARS_FILE" ]]; then
    DEFAULT_TFVARS="terraform/terraform.tfvars"
    [[ -f "$DEFAULT_TFVARS" ]] && TFVARS_FILE="$DEFAULT_TFVARS"
  fi
  [[ -n "$TFVARS_FILE" ]] && TF_APPLY_ARGS+=("-var-file=$TFVARS_FILE")
else
  TF_APPLY_ARGS+=("-var=deploy_environments=[\"$ENVIRONMENT\"]")
  if [[ -z "$TFVARS_FILE" ]]; then
    DEFAULT_TFVARS="terraform/${ENVIRONMENT}.tfvars"
    [[ -f "$DEFAULT_TFVARS" ]] && TFVARS_FILE="$DEFAULT_TFVARS"
  fi
  [[ -n "$TFVARS_FILE" ]] && TF_APPLY_ARGS+=("-var-file=$TFVARS_FILE")
fi

if [[ -n "$TFVARS_FILE" && ! -f "$TFVARS_FILE" ]]; then
  echo "tfvars file '$TFVARS_FILE' not found" >&2
  exit 1
fi

aws eks update-kubeconfig --name "$EKS_CLUSTER_NAME" --region "$AWS_REGION"

echo "Running Terraform apply for environment: $ENVIRONMENT..."
terraform -chdir=terraform init -input=false
terraform -chdir=terraform apply -input=false -auto-approve "${TF_APPLY_ARGS[@]}"

echo "Deploying monitoring stack..."
kubectl apply -f k8s/monitoring-stack.yaml

echo "Deployment complete."
