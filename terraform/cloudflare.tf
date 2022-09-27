terraform {
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

resource "cloudflare_record" "gangoffront_com" {
  name    = var.domain
  proxied = true
  ttl     = 1
  type    = "CNAME"
  value   = "gangoffront-com.pages.dev"
  zone_id = var.zone_id
}

resource "cloudflare_zone_settings_override" "gangoffront_com_settings" {
  zone_id = var.zone_id

  settings {
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    ssl                      = "strict"
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
