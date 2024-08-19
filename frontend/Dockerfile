FROM --platform=$BUILDPLATFORM node:18-alpine AS build
ARG TARGETPLATFORM
ARG BUILDPLATFORM

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]