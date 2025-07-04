FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/src ./src
COPY --from=builder /app/proto ./proto
COPY .sequelizerc ./.sequelizerc

RUN mkdir -p ./src/uploads

EXPOSE 3000
CMD ["node", "server.js"]
