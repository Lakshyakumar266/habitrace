
#Stage 1: Builder (build dependencies for application)
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files and Prisma schema first
COPY package*.json bun.lock ./ 
COPY prisma ./prisma 

RUN bun install --frozen-lockfile --ignore-scripts && \
    bun prisma generate 

# Copy all source code
COPY . .

#Stage 2: runtime (Create runtime image)

FROM oven/bun:canary-alpine AS runtime
WORKDIR /app


# Copy node_modules and generated Prisma client from builder
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/prisma prisma

COPY --from=builder /app .


EXPOSE 3000/tcp
CMD ["bun", "start"]