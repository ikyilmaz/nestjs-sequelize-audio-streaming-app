<p align="center">
    <a 
    href="http://nestjs.com/"
    target="blank">
        <img 
        src="https://nestjs.com/img/logo_text.svg" 
        width="320" 
        alt="Nest Logo" />
    </a>
</p>

<br>

> ### Technologies implemented:

-   [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) (ORM) + [PostgreSQL](https://www.postgresql.org/)
-   [Redis](https://redis.io/)
-   [JWT](https://jwt.io/)
-   [Swagger](https://swagger.io/)

<br>


> ## Installation

```bash
$ npm install
```

<br>


> ## Setting up the database for development and test

PostgreSQL database connection options are shown in the following table:

| Option   | Development | Test      |
| -------- | ----------- | --------- |
| Host     | localhost   | localhost |
| Port     | 5432        | 5432      |
| Username | postgres    | postgres  |
| Database | music       | music     |

<br>

> ## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
<br>

> ### Other commands

```bash
# formatting code
$ npm run format

# run linter
$ npm run lint

```

<br>

> ## Development Configuration

```
NODE_ENV=development
DB_DIALECT=postgres
DB_PORT=5432
DB_USER=postgres
DATABASE_PASSWORD=postgres
DB_NAME=music
JWT_SECRET=jwt-secret
JWT_EXPIRES_IN=90d
PORT=8080
HOST=localhost
```

<br>

> # Swagger API docs

This project uses the Nest swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)  
Swagger docs will be available at localhost:8080/api
