terraform {
  cloud {
    organization = "gangoffront"

    workspaces {
      name = "gangoffrontcom"
    }
  }
  # backend "s3" {
  #   bucket         = "terraform-gangoffront-state-prod"
  #   key            = "terraform-cloudflare/zones/gangoffront-com/02-page-rules"
  #   region         = "us-east-1"
  #   encrypt        = "true"
  #   dynamodb_table = "terraform-gangoffront-state-lock-prod"
  #   acl            = "bucket-owner-full-control"
  # }
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
  }
}

provider "cloudflare" {}

variable "zone_id" {
  default = "0b140084d6f4cd3e6b278eedcf6fec1a"
}

variable "account_id" {
  default = "5df477d4f9a8cf72185ef8f44fd1e144"
}

variable "domain" {
  default = "gangoffront.com"
}

variable "project_name" {
  default = "gangoffront-com"
}

resource "cloudflare_record" "www" {
  name    = "www"
  proxied = true
  ttl     = 1
  type    = "AAAA"
  value   = "100::"
  zone_id = var.zone_id
}

resource "cloudflare_record" "gangoffront_com_pages" {
  name    = "gangoffront.com"
  proxied = true
  ttl     = 1
  type    = "CNAME"
  value   = "gangoffront-com.pages.dev"
  zone_id = "0b140084d6f4cd3e6b278eedcf6fec1a"
}

resource "cloudflare_zone_settings_override" "gangoffront_com_settings" {
  zone_id = var.zone_id

  settings {
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    ssl                      = "strict"
  }
}

resource "cloudflare_page_rule" "www_to_gangoffront_com" {
  priority = 1
  status   = "active"
  target   = "www.${var.domain}/*"
  zone_id  = var.zone_id
  actions {
    forwarding_url {
      status_code = 301
      url         = "https://${var.domain}/*"
    }
  }
}

resource "cloudflare_pages_project" "gangoffront_com" {
  account_id        = var.account_id
  name              = "gangoffront-com"
  production_branch = "main"
  build_config {
    destination_dir = "build"
    build_command   = "npm run build"
    root_dir        = "/"
  }
  source {
    type = "github"
    config {
      owner                         = "gang-of-front"
      repo_name                     = "gangoffront.com"
      production_branch             = "main"
      pr_comments_enabled           = true
      deployments_enabled           = false
      production_deployment_enabled = false
      preview_branch_includes       = ["preview"]
      preview_branch_excludes       = ["main"]
    }
  }
}
