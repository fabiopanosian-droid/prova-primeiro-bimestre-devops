data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "this" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [var.security_group_id]

  iam_instance_profile = var.instance_profile

  user_data = <<-EOF_USERDATA
              #!/bin/bash
              set -e

              dnf update -y
              dnf install -y docker git

              systemctl enable docker
              systemctl start docker

              until docker info >/dev/null 2>&1; do
                sleep 2
              done

              git clone https://github.com/fabiopanosian-droid/prova-primeiro-bimestre-devops.git /opt/prova-devops

              cat > /opt/prova-devops/.env <<ENV
              DB_HOST=${var.db_host}
              DB_PORT=5432
              DB_NAME=reservas
              DB_USER=${var.db_username}
              DB_PASSWORD=${var.db_password}
              PORT=3000
              ENV

              docker build -t reservas-api /opt/prova-devops/app

              docker run -d \
                --name reservas-api \
                --restart unless-stopped \
                --env-file /opt/prova-devops/.env \
                -p 3000:3000 \
                reservas-api
              EOF_USERDATA

  tags = {
    Name        = "${var.project_name}-ec2"
    Environment = var.environment
  }
}
