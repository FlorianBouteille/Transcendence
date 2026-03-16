FROM nginx:1.27-alpine

# Copie la config nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copie directement les fichiers frontend
COPY frontend /usr/share/nginx/html

COPY nginx/certs/cert.pem /etc/nginx/certs/cert.pem
COPY nginx/certs/key.pem /etc/nginx/certs/key.pem


EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]