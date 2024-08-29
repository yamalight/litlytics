FROM oven/bun:slim

WORKDIR /app

COPY deploy .

EXPOSE 3000
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

CMD ["bun", "server.js"]
