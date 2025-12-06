FROM node:20-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

# Устанавливаем ВСЕ зависимости, включая dev
RUN npm install

# Генерация Prisma Client
RUN npx prisma generate

COPY . .

# Сборка проекта NestJS
RUN npm run build

# -------------------------
# Production image
# -------------------------
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000

CMD ["node", "dist/main.js"]
    