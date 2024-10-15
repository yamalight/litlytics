# install deps
FROM oven/bun:slim AS base
ENV CI=true
ENV NODE_ENV=production

WORKDIR /app
# install deps
ADD package.json bun.lockb ./
ADD ./packages/litlytics ./packages/litlytics
RUN cd ./packages/litlytics && bun install --frozen-lockfile && bun run build
RUN bun install --frozen-lockfile --ignore-scripts

# build app
COPY . .
RUN bun run build

# run app
FROM node:22-slim AS runner
ENV CI=true
ENV NODE_ENV=production

WORKDIR /app

COPY --from=base /app /app

EXPOSE 3000
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

CMD ["npm", "run", "start"]