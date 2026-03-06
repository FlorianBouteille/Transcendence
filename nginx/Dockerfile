FROM nginx:1.27-alpine

# Copie la config nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copie les certificats SSL
COPY nginx/ssl /etc/nginx/ssl

# Copie directement les fichiers frontend
COPY frontend /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]