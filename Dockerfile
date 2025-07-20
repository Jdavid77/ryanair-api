FROM node:22-alpine AS base
RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Production Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && \
    npm cache clean --force

# Build stage
FROM base AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime
FROM base AS runtime
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/dist ./dist
COPY --chown=nextjs:nodejs package.json ./package.json

USER nextjs
EXPOSE 3000
ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
