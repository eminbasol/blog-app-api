## stage 1
FROM node:20-alpine3.19 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma prisma
RUN npx prisma generate
COPY src src
COPY tsconfig.json .
COPY wait-for-db.sh ./
RUN chmod +x wait-for-db.sh
RUN npm run build

## stage 2
FROM node:20-alpine3.19
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/prisma prisma
RUN npx prisma generate
COPY --from=builder /app/dist dist
COPY --from=builder /app/wait-for-db.sh ./ 
CMD ["./wait-for-db.sh", "db", "5432", "--", "npm", "run", "start:prod"]
