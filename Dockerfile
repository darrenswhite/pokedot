# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /pokedot
COPY package.json package-lock.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /pokedot
COPY . .
COPY --from=deps /pokedot/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /pokedot

ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /pokedot/next.config.js ./
# COPY --from=builder /pokedot/public ./public
COPY --from=builder /pokedot/.next ./.next
COPY --from=builder /pokedot/node_modules ./node_modules

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /pokedot/.next
USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# RUN npx next telemetry disable

CMD ["node_modules/.bin/next", "start"]