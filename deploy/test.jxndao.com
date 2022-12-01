server {
    listen 80;
    server_name test.jxndao.com www.test.jxndao.com;
    return 301 https://test.jxndao.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.test.jxndao.com;

    ssl_certificate     /etc/letsencrypt/live/test.jxndao.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/test.jxndao.com/privkey.pem;

    return 301 https://test.jxndao.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name test.jxndao.com;

    ssl_certificate     /etc/letsencrypt/live/test.jxndao.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/test.jxndao.com/privkey.pem;

    index index.html index.htm index.nginx.debian.html;

    location ^~ /walletconnect-v2 {
        alias /home/ubuntu/ndj-depositor-wc2/build;
        try_files $uri $uri/ /walletconnect-v2/index.html;
    }

    location ^~ /storefront {
        alias /home/ubuntu/storefront/build;
        try_files $uri $uri/ /storefront/index.html;
    }

    location ^~ /mint {
        alias /home/ubuntu/mint;
        try_files $uri $uri/ /mint/index.html;
    }


    location /          {
        root /home/ubuntu/ndj-depositor-test/build;
        try_files $uri $uri/ /index.html =404;
    }
}