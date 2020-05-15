import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as chalk from 'chalk';
import { setupSwagger } from './swagger';

(async function() {
    const app = await NestFactory.create(AppModule, {});

    app.useGlobalPipes(new ValidationPipe());

    app.setGlobalPrefix('api/v1');

    setupSwagger(app)

    await app.listen(process.env.PORT);
})()
    .catch(err => console.log(err))
    .then(() => console.log(chalk.magentaBright('--> READY TO GO ON %s'), `http://${process.env.HOST}:${process.env.PORT}`));
