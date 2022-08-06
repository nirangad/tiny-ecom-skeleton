FROM node:17-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./

RUN npm install
RUN npm install --location=global typescript

COPY src ./src/

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]