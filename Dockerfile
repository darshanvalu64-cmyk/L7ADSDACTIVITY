# Stage 1: build the React front end.
FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN rm -rf dist && npm run build

# Stage 2: compile the Express back end.
FROM node:22-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN rm -rf dist && npm run build

# Stage 3: production runtime image.
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

# Install only the server's production dependencies.
COPY server/package*.json ./
RUN npm ci --omit=dev \
  && npm cache clean --force \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Copy the outputs from the build stages.
COPY --from=server-build /app/server/dist ./dist
COPY --from=client-build /app/client/dist ./public

ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION}

EXPOSE 3000
USER node

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist/server.js"]
 # npm is removed afterwards because the running app never needs it, and
# every package left in the image is one more thing to patch.
COPY server/package*.json ./
RUN npm ci --omit=dev \
  && npm cache clean --force \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --from=server-build /app/server/dist ./dist
COPY --from=client-build /app/client/dist ./public