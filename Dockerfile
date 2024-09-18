# install deps
FROM oven/bun:slim AS base

# install code dep for pdf.js
RUN sudo apt-get install libgif-dev

WORKDIR /app
ADD package.json bun.lockb ./
RUN bun install --ci

# build app
FROM base AS build
ENV NODE_ENV=production
ENV DEPLOY_URL=https://ll-demo.codezen.dev

WORKDIR /app
COPY . .
RUN bun run build

# run app
FROM node:22-slim AS runner
ENV NODE_ENV=production

WORKDIR /app

COPY --from=base /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY . .

EXPOSE 3000
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

CMD ["npm", "run", "start"]
