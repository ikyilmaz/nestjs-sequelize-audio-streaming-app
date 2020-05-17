import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UsersModule } from './modules/users/users.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { AuthModule } from './modules/auth/auth.module';
import { AlbumsRelatedModule } from './modules/albums/albums-related/albums-related.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { TracksRelatedModule } from './modules/tracks/tracks-related/tracks-related.module';
import { UsersRelatedModule } from './modules/users/users-related/users-related.module';
import { CurrentUserModule } from './modules/current-user/current-user.module';

export const setupSwagger = (app: INestApplication) => {
    const options = new DocumentBuilder()
        .setTitle('Something')
        .setDescription('The API description')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options, {
        include: [
            AuthModule,

            UsersModule,
            UsersRelatedModule,
            CurrentUserModule,

            AlbumsModule,
            AlbumsRelatedModule,

            TracksModule,
            TracksRelatedModule,
        ],
    });

    SwaggerModule.setup('api', app, document);
};