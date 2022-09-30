# Production Environment
resource "cloudflare_record" "www" {
  name    = "www"
  proxied = true
  ttl     = 1
  type    = "AAAA"
  value   = "100::"
  zone_id = var.zone_id
}
resource "cloudflare_record" "gangoffront_com_pages" {
  name    = var.domain
  proxied = true
  ttl     = 1
  type    = "CNAME"
  value   = format("%s.pages.dev", var.project_name)
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

resource "cloudflare_page_rule" "www_to_gangoffront_com" {
  priority = 1
  status   = "active"
  target   = "www.${var.domain}/*"
  zone_id  = var.zone_id

  actions {
    forwarding_url {
      status_code = 301
      url         = "https://${var.domain}"
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
# Staging Environment
resource "cloudflare_record" "staging_gangoffront_com_pages" {
  name    = format("staging.%s", var.domain)
  proxied = true
  ttl     = 1
  type    = "CNAME"
  value   = format("staging.%s.pages.dev", var.project_name)
  zone_id = var.zone_id
}
