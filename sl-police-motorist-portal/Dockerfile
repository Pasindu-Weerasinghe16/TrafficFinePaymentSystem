# Build stage — Vite
ARG NODE_BASE_IMAGE=node:24.16.0-alpine
FROM ${NODE_BASE_IMAGE} AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage — Nginx serves the built dist/
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA fallback: all routes serve index.html
RUN printf 'server {\n  listen 3000;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
