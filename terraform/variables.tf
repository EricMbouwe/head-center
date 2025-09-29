variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3"
}

variable "state_bucket" {
  description = "S3 bucket for Terraform state"
  type        = string
}

variable "state_key_suffix" {
  description = "Object key suffix for Terraform state (supports environment partitioning)"
  type        = string
  default     = "terraform.tfstate"
}

variable "environments" {
  description = "Map of environment names to deployment configuration"
  type = map(object({
    namespace = string
    image_tag = string
    replicas  = optional(number)
  }))
  default = {
    staging = {
      namespace = "web-staging"
      image_tag = "staging"
      replicas  = 1
    }
    production = {
      namespace = "web-prod"
      image_tag = "production"
      replicas  = 3
    }
  }
}

variable "deploy_environments" {
  description = "Optional list of environment names to deploy. Empty list deploys all."
  type        = list(string)
  default     = []
  validation {
    condition = length([for env in var.deploy_environments : env if !contains(keys(var.environments), env)]) == 0
    error_message = "deploy_environments must reference keys defined in environments."
  }
}

variable "supabase_credentials" {
  description = "Supabase credentials per environment"
  type = map(object({
    url      = string
    anon_key = string
  }))
  sensitive = true
  validation {
    condition = length([
      for env in (length(var.deploy_environments) > 0 ? var.deploy_environments : keys(var.environments)) :
      env if !contains(keys(var.supabase_credentials), env)
    ]) == 0
    error_message = "Provide Supabase credentials for each active environment."
  }
}
