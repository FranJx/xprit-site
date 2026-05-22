# Stage 1: Build the Vite frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
# We set VITE_SERVER_URL to empty so it uses relative paths (connecting back to the same server hosting it)
ENV VITE_SERVER_URL=""
RUN npm run build

# Stage 2: Set up the production Node backend
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./

# Copy the built Vite frontend assets to server's public folder
COPY --from=frontend-builder /app/client/dist ./public

ENV PORT=4000
ENV NODE_ENV=production

EXPOSE 4000
CMD ["node", "index.js"]
