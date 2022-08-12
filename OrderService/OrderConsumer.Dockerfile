FROM node:17-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY .env ./

RUN npm install
RUN npm install --location=global typescript

COPY src/common ./src/common/
COPY src/services ./src/services/

RUN npm run build

CMD [ "npm", "run", "start:consumer" ]