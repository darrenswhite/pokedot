FROM node:14-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /pokedot

COPY package.json package-lock.json ./
RUN npm ci

FROM node:14-alpine AS proddeps

WORKDIR /pokedot

COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:14-alpine AS builder

WORKDIR /pokedot

COPY . .
COPY --from=deps /pokedot/node_modules ./node_modules
RUN npm run build
RUN npm run export

FROM node:14-alpine AS runner

WORKDIR /pokedot

COPY --from=builder /pokedot/out ./out
COPY --from=proddeps /pokedot/node_modules ./node_modules
COPY --from=builder /pokedot/serve.js ./
COPY --from=builder /pokedot/package.json ./

RUN addgroup -g 1001 -S nodejs
RUN adduser -S pokedot -u 1001
RUN chown -R pokedot:nodejs /pokedot
USER pokedot

EXPOSE 3000

CMD ["npm", "start"]
