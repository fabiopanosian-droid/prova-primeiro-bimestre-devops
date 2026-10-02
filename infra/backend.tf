terraform {
  backend "s3" {
    bucket         = "prova-devops-terraform-state-843745449662"
    key            = "prova-devops/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "prova-devops-terraform-lock"
    encrypt        = true
  }
}
