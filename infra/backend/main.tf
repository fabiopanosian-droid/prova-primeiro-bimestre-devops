terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

data "aws_caller_identity" "current" {}

locals {
  state_bucket = "prova-devops-terraform-state-${data.aws_caller_identity.current.account_id}"
}

resource "aws_dynamodb_table" "terraform_lock" {
  name         = "prova-devops-terraform-lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "prova-devops-terraform-lock"
    Environment = "prova"
  }
}

resource "null_resource" "terraform_state_bucket" {
  triggers = {
    bucket = local.state_bucket
  }

  provisioner "local-exec" {
    command = <<-EOT
      aws s3api put-bucket-versioning \
        --bucket ${local.state_bucket} \
        --versioning-configuration Status=Enabled

      aws s3api put-bucket-encryption \
        --bucket ${local.state_bucket} \
        --server-side-encryption-configuration '{
          "Rules": [
            {
              "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "AES256"
              }
            }
          ]
        }'

      aws s3api put-public-access-block \
        --bucket ${local.state_bucket} \
        --public-access-block-configuration \
        BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
    EOT
  }
}

output "state_bucket" {
  value = local.state_bucket
}

output "lock_table" {
  value = aws_dynamodb_table.terraform_lock.name
}
