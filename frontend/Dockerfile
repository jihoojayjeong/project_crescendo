# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .


# Add ARG for PUBLIC_URL to be passed during build
ARG PUBLIC_URL
ENV PUBLIC_URL=$PUBLIC_URL

# Development stage
FROM build as development
ENV NODE_ENV=development
CMD ["npm", "start"]

# Production build stage
FROM build as production-build
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM nginx:alpine as production
COPY --from=production-build /app/build /usr/share/nginx/html
COPY ./config/nginx.config /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]