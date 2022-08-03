# tiny-ecom-skeleton
Tiniest E Commerce skeleton with microservices architecture with NodeJS. This is an attempt to cover basics of microservices architecture

## Tools and Technologies

- ```express``` for exposing REST endpoints
- ```jsonwebtoken``` for authentication tokens
- ```amqplib``` as a client for RabbitMQ
- ```mongoose``` as the Object data Mapper for MongoDB
- ```@nirangad/is-authenticated``` is used as a middleware for ```express``` to validate Authorization header for the token
  - [NPM](https://www.npmjs.com/package/@nirangad/is-authenticated) - ```npm i @nirangad/is-authenticated```
  - [GitHub Repo](https://github.com/nirangad/is-authenticated)
- For input validation, ```express-validator``` is used
  - Reference: https://express-validator.github.io/docs/
- ```winston``` and ```express-winston``` for Logging. ```access.log``` and ```error.log``` will be created under ```logs``` folder
  - Comment/Uncomment ```app.use(logger())``` in the ```index.ts``` of any service
- ```i18next``` used to handle localization in the API responses.
  - At the moment it supports only English and German
  - New languages can be enabled by updating ```supportedLngs``` in ```common\locales\localize.ts```
  - New resources file should be placed in ```common\locales\i18n``` with ```<language_code>.json``` as the file name
  - German translation are taken directly from Google Translate. So might not be accurate

## Top level architecture

![Basic architecture](https://github.com/nirangad/tiny-ecom-skeleton/blob/main/assets/MicroservicesDemo.png)