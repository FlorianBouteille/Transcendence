#premier conteneur tmpr : sert a compiler le frontend
FROM node:20-alpine AS frontend_builder

WORKDIR /frontend

COPY ../frontend/package*.json ./
#RUN npm ci IC <= a remplacer
# RUN npm install --omit=dev

COPY frontend ./

# RUN npm run build

#nouveau conteneur propre sans node
FROM nginx:1.27-alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

#mutlistage build 
COPY --from=frontend_builder /frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]