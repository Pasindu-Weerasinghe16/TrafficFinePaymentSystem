ARG NODE_BASE_IMAGE=node:24.16.0-alpine
FROM ${NODE_BASE_IMAGE}
WORKDIR /workspace
COPY package.json ./
COPY server.cjs ./
COPY index.html ./
COPY index.css ./
COPY app.js ./
EXPOSE 3000
# .cjs keeps this CommonJS script working despite "type": "module" in package.json
CMD ["node", "server.cjs"]
