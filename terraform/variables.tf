variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3"
}

variable "state_bucket" {
  description = "S3 bucket for Terraform state"
  type        = string
}

variable "kubernetes_namespace" {
  description = "Namespace for application deployment"
  type        = string
  default     = "web"
}

variable "supabase_url" {
  description = "Supabase project URL"
  type        = string
}

variable "supabase_anon_key" {
  description = "Supabase anon key"
  type        = string
  sensitive   = true
}
