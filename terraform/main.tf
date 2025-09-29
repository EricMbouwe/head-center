terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.21"
    }
  }
  backend "s3" {
    bucket = var.state_bucket
    key    = "head-center/terraform.tfstate"
    region = var.region
  }
}

provider "aws" {
  region = var.region
}

module "network" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "head-center-vpc"
  cidr = "10.0.0.0/16"

  azs             = slice(data.aws_availability_zones.available.names, 0, 2)
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.11.0/24", "10.0.12.0/24"]

  enable_nat_gateway = true
}

data "aws_availability_zones" "available" {}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "20.11.0"
  cluster_name    = "head-center"
  cluster_version = "1.29"
  subnet_ids      = module.network.private_subnets
  vpc_id          = module.network.vpc_id

  eks_managed_node_groups = {
    default = {
      instance_types = ["t3.medium"]
      desired_size   = 2
      min_size       = 2
      max_size       = 4
    }
  }
}

resource "aws_ecr_repository" "head_center" {
  name                 = "head-center"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

module "app" {
  source = "./modules/app"

  namespace          = var.kubernetes_namespace
  image_uri          = "${aws_ecr_repository.head_center.repository_url}:latest"
  supabase_url       = var.supabase_url
  supabase_anon_key = var.supabase_anon_key
}
