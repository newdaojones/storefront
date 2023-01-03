server {
    listen 80;
    server_name pay.storefrontpay.app;
    # certbot endpoint
    location ~ ^/\.well-known/ {
        root /home/ubuntu/storefront-prod/build;
        access_log off;
    }
    # other requests should end up here
    location / {
        return 301 https://$host$request_uri;
    }
}
server {
    listen 443 ssl http2;
    server_name merchant.storefrontpay.app;

    #ssl_certificate     /etc/letsencrypt/live/merchant.storefrontpay.app/fullchain.pem;
    #ssl_certificate_key /etc/letsencrypt/live/merchant.storefrontpay.app/privkey.pem;

    root /home/ubuntu/storefront-prod/build;
    index index.html index.htm index.nginx.debian.html;

    location /          {
        try_files $uri $uri/ /index.html =404;
    }
}
