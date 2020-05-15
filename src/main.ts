import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AlbumsModule } from './modules/albums/albums.module';
import * as chalk from 'chalk';
import { AuthModule } from './modules/auth/auth.module';

(async function() {
    const app = await NestFactory.create(AppModule, {});

    app.useGlobalPipes(new ValidationPipe());

    app.setGlobalPrefix('api/v1');

    const options = new DocumentBuilder()
        .setTitle('Something')
        .setDescription('The API description')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options, {
        include: [UsersModule, AlbumsModule, AuthModule],
    });

    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT);
})()
    .catch(err => console.log(err))
    .then(() => console.log(chalk.magentaBright('--> READY TO GO ON %s'), `http://${process.env.HOST}:${process.env.PORT}`));
