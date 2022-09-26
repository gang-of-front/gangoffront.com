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

variable "domain" {
  default = "gangoffront.com"
}

resource "cloudflare_record" "www" {
  zone_id = var.zone_id
  name    = "www"
  value   = "203.0.113.10"
  type    = "A"
  proxied = true
}

resource "cloudflare_zone_settings_override" "gangoffront-com-settings" {
  zone_id = var.zone_id

  settings {
    http2                    = "on"
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    ssl                      = "strict"
  }
}

resource "cloudflare_record" "www-asia" {
  zone_id = var.zone_id
  name    = "www"
  value   = "198.51.100.15"
  type    = "A"
  proxied = true
}

resource "cloudflare_load_balancer_monitor" "get-root-https" {
  expected_body    = "alive"
  expected_codes   = "200"
  method           = "GET"
  timeout          = 5
  path             = "/"
  interval         = 60
  retries          = 2
  description      = "GET / over HTTPS - expect 200"
  allow_insecure   = false
  follow_redirects = true
}

resource "cloudflare_load_balancer_pool" "www-servers" {
  name    = "www-servers"
  monitor = cloudflare_load_balancer_monitor.get-root-https.id
  origins {
    name    = "www-us"
    address = "203.0.113.10"
  }
  origins {
    address = "198.51.100.15"
    name    = "www-asia"
  }
  description        = "www origins"
  enabled            = true
  minimum_origins    = 1
  notification_email = "rafaelantoniolucio@gmail.com"
  check_regions      = ["WNAM", "ENAM", "WEU", "EEU", "SEAS", "NEAS"]
}

resource "cloudflare_load_balancer" "www-lb" {
  zone_id          = var.zone_id
  name             = "www-lb"
  default_pool_ids = [cloudflare_load_balancer_pool.www-servers.id]
  fallback_pool_id = cloudflare_load_balancer_pool.www-servers.id
  description      = "gangoffront load balancer"
  proxied          = true
}
