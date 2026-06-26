ARG NODE_BASE_IMAGE=node:24.16.0-alpine
FROM ${NODE_BASE_IMAGE}
WORKDIR /workspace
COPY package.json ./
COPY server.js ./
COPY index.html ./
COPY index.css ./
COPY app.js ./
EXPOSE 3000
CMD ["node", "server.js"]
