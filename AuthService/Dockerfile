FROM node:17

WORKDIR /app

COPY package* ./
COPY tsconfig.json ./

RUN npm install
RUN npm install -g typescript
RUN npm run build

RUN ls -la

COPY *.js .

EXPOSE 8080

CMD [ "npm", "start" ]