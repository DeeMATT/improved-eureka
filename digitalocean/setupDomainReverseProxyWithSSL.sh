#!/bin/bash
function generateDomainReverseProxy(){
  echo "about to start executing on the server within the function"
  local fqdn=$1
  local proxyTarget=$2

  echo "
    server {
        listen       80;
        server_name  $fqdn;

        location = / {
                  proxy_pass "$proxyTarget"index.html;
          }
          location / {
              proxy_pass $proxyTarget;
              proxy_set_header User-Agent \$http_user_agent;
              proxy_set_header X-Real-IP \$remote_addr;
              proxy_set_header Accept-Encoding '""';
              proxy_set_header Accept-Language \$http_accept_language;
              proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
          }

    }

    server {
        listen       80;
        server_name  app."$fqdn";

        location / {
            proxy_pass https://app.lolafinance.com;
            proxy_set_header User-Agent \$http_user_agent;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header Accept-Encoding '""';
            proxy_set_header Accept-Language \$http_accept_language;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        }
    }

  " > /etc/nginx/sites-available/"$fqdn"

  sudo rm -rf /etc/nginx/sites-enabled/"$fqdn"
  sudo ln -s /etc/nginx/sites-available/"$fqdn" /etc/nginx/sites-enabled/"$fqdn"
  sudo service nginx reload
  sudo certbot --nginx -d $fqdn 
  sudo certbot --nginx -d app."$fqdn"
}
echo "about to call function to start domain installation"
generateDomainReverseProxy "$1" "$2"
