# Dépôt autonome, un seul paquet — pas de contexte monorepo à gérer, à la
# différence du Dockerfile d'apps/site dans websig-platform.
#
# docker build -t websig-geometres .

FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
# Pas de dossier public/ dans ce projet — rien à copier, contrairement au
# patron apps/site qui y sert des captures d'écran de projets.

EXPOSE 3000
CMD ["node", "server.js"]
