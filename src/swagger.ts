import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UsersModule } from './modules/users/users.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { AuthModule } from './modules/auth/auth.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { UsersRelatedModule } from './modules/users/users-related/users-related.module';
import { CurrentUserModule } from './modules/current-user/current-user.module';
import { TrackCommentsModule } from './modules/tracks/track-comments/track-comments.module';
import { TrackFeatsModule } from './modules/tracks/track-feats/track-feats.module';
import { TrackLikesModule } from './modules/tracks/track-likes/track-likes.module';
import { AlbumCommentsModule } from './modules/albums/album-comments/album-comments.module';
import { AlbumFeatsModule } from './modules/albums/album-feats/album-feats.module';
import { AlbumLikesModule } from './modules/albums/album-likes/album-likes.module';

export const setupSwagger = (app: INestApplication) => {
    const options = new DocumentBuilder()
        .setTitle('Something')
        .setDescription('The API description')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options, {
        include: [
            // !! AUTH !!
            AuthModule,

            // !! USERS !!
            UsersModule,
            UsersRelatedModule,

            // !! CURRENT USER !!
            CurrentUserModule,

            // !! ALBUMS !!
            AlbumsModule,
            AlbumCommentsModule,
            AlbumFeatsModule,
            AlbumLikesModule,

            // !! TRACKS !!
            TracksModule,
            TrackCommentsModule,
            TrackFeatsModule,
            TrackLikesModule,
        ],
    });

    SwaggerModule.setup('api', app, document);
};