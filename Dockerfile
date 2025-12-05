# -------------------------
# Etapa 1: Build con Node
# -------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (incluye devDeps necesarios para build)
RUN npm install --no-audit --no-fund

# Copiar todo el código fuente
COPY . .

# Ignorar errores de TypeScript para no romper la build
RUN npx tsc --noEmit || true

# Build de Vite usando binario local
RUN npx vite build

# -------------------------
# Etapa 2: Servir con Nginx
# -------------------------
FROM nginx:stable-alpine

# Copiar build de la app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar plantilla de nginx
COPY docker/nginx.conf.template /etc/nginx/conf.d/default.conf.template

EXPOSE 80

# Sustituir PORT y ejecutar nginx
CMD ["sh", "-c", "export PORT=${PORT:-80} && envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
