FROM oven/bun:1.1.29-alpine

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

ARG VERSION
ENV VITE_VERSION=$VERSION

COPY public ./public
RUN echo "{ \"version\": \"${VERSION}\" }" > ./public/version.json

COPY index.html ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY src ./src
COPY backend ./backend

RUN bun run build

EXPOSE 8000

CMD ["bun", "start:server"]
