# Stage 1: Build
FROM node:18-buster as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .
# Copy .env.prod to Docker image
COPY .env.prod .env
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:18-buster as production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/.env .env

# Set environment variables
ENV JWT_PRIVATE=$JWT_PRIVATE
CMD ["node", "build/index.js"]
