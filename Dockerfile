# Multi-stage Dockerfile for building Vite + React TypeScript app and serving with nginx
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies (including devDeps needed for build)
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# Copy build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx template (we'll substitute $PORT at container start)
COPY docker/nginx.conf.template /etc/nginx/conf.d/default.conf.template

EXPOSE 80

# Substitute PORT (default 80) and run nginx in foreground
CMD ["sh", "-c", "export PORT=${PORT:-80} && envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
