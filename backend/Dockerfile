FROM --platform=$BUILDPLATFORM node:18-alpine AS build
ARG TARGETPLATFORM
ARG BUILDPLATFORM

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]