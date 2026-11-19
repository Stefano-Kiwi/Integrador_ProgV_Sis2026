FROM node:22-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para Prisma y Postgres
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias completas
RUN npm ci

# Copiar esquema de Prisma y generar el cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar el código fuente restante
COPY . .

# Compilar NestJS a producción (dist)
RUN npm run build

# Configurar script de inicio para seeder y arranque
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
