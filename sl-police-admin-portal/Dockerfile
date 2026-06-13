ARG NODE_BASE_IMAGE=node:24.16.0-alpine
FROM ${NODE_BASE_IMAGE}
WORKDIR /workspace
COPY package.json ./
COPY server.js ./
EXPOSE 3001
CMD ["node", "server.js"]
