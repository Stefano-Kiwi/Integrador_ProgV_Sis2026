# Etapa 1: Construcción (Build)
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependencias del proyecto
COPY package*.json ./
RUN npm install

# Copiar el código fuente y compilar los archivos de distribución
COPY . .
RUN npm run build

# Etapa 2: Servidor Web de Producción con Nginx
FROM nginx:alpine

# Generar certificado SSL autofirmado para soporte HTTPS (requerido para la cámara web en navegadores móviles)
RUN apk add --no-cache openssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/certs/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=AR/ST=EntreRios/L=Concordia/O=FitZone/CN=localhost"

# Copiar los artefactos generados por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx para SPA y proxy inverso al backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puertos HTTP y HTTPS
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
