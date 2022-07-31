# tiny-ecom-skeleton
Tiniest E Commerce skeleton with microservices architecture with NodeJS. This is an attempt to cover basics of microservices architecture

## Technologies

- ```express``` for exposing REST endpoints
- ```jsonwebtoken``` for authentication tokens
- ```amqplib``` as a client for RabbitMQ
- ```mongoose``` as the Object data Mapper for MongoDB
- ```@nirangad/is-authenticated``` used as a middleware for ```express``` to validate Authorization header for the token
  - [NPM](https://www.npmjs.com/package/@nirangad/is-authenticated) - ```npm i @nirangad/is-authenticated```
  - [GitHub Repo](https://github.com/nirangad/is-authenticated)


## Top level architecture

!(/assets/MicroservicesDemo.png)