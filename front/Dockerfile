# Etapa de construcción (build)
FROM node:22-alpine AS builder
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm config set "strict-ssl" false
RUN npm install --production
RUN npm run build

# No need for the Nginx stage anymore, as we're using a separate Nginx container
