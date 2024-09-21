# Base stage
FROM node:16-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Development stage
FROM base as development
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base as production
ENV NODE_ENV=production
CMD ["npm", "run", "start:prod"]