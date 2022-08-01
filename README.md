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
- ```winston``` and ```express-winston``` for Logging. ```access.log``` and ```error.log``` will be created under ```logs``` folder
  - Comment/Uncomment ```app.use(logger())``` in the ```index.ts``` of any service


## Top level architecture

![Basic architecture](https://github.com/nirangad/tiny-ecom-skeleton/blob/main/assets/MicroservicesDemo.png)