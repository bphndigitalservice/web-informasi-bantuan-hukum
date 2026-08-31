# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm (pin version; pnpm@latest requires Node 22.13+)
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Change ownership
RUN chown -R astro:nodejs /app

USER astro

# Expose port
EXPOSE 4321

ENV HOST=0.0.0.0
ENV PORT=4321

# Start the server
CMD ["node", "./dist/server/entry.mjs"]
