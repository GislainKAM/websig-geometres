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
# `output: 'standalone'` n'embarque ni .next/static ni public/ : les deux
# doivent être copiés explicitement, sinon les fichiers servis depuis la
# racine renvoient 404 alors que le build est vert et que le HTML les
# référence. Constaté en production le 19 août 2026 sur /og/apercu.jpg,
# ajouté sans toucher à ce fichier.
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
