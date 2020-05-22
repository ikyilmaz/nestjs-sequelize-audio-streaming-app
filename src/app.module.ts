import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { AuthModule } from './modules/auth/auth.module';
import { CurrentUserRequestModule } from '@app/current-user';
import { TokenModule } from '@app/token';
import { TracksModule } from './modules/tracks/tracks.module';
import { SequelizeConfigService } from './sequelize';
import { SyncController } from './helpers/sync/sync.controller';
import { CurrentUserModule } from './modules/current-user/current-user.module';
import { RedisModule } from 'nestjs-redis';
import { redisModuleOptions } from './redis/redis.config';
import User from './models/user/user.model';
import UserProfile from './models/user-profile/user-profile.model';
import Album from './models/album/album.model';
import Track from './models/track/track.model';
import TrackLike from './models/m2m/like/track-like/track-like.model';
import { TrackCommentsModule } from './modules/tracks/track-comments/track-comments.module';
import { TrackLikesModule } from './modules/tracks/track-likes/track-likes.module';
import { TrackFeatsModule } from './modules/tracks/track-feats/track-feats.module';
import { AlbumFeatsModule } from './modules/albums/album-feats/album-feats.module';
import { AlbumLikesModule } from './modules/albums/album-likes/album-likes.module';
import { AlbumCommentsModule } from './modules/albums/album-comments/album-comments.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SequelizeModule.forRootAsync({ useClass: SequelizeConfigService }),
        SequelizeModule.forFeature([User, UserProfile, Album, Track, TrackLike]), // For Sync Controller
        RedisModule.register(redisModuleOptions),

        // !! CURRENT USER !! (LIBRARY MODULE)
        CurrentUserRequestModule,

        // !! TOKEN !! (LIBRARY MODULE)
        TokenModule,

        // !! AUTH !!
        AuthModule,

        // !! USERS !!
        UsersModule,

        // !! CURRENT USER !!
        CurrentUserModule,

        // !! ALBUMS !!
        AlbumCommentsModule,
        AlbumFeatsModule,
        AlbumLikesModule,
        AlbumsModule,

        // !! TRACKS !!
        TrackCommentsModule,
        TrackFeatsModule,
        TrackLikesModule,
        TracksModule,
    ],

    controllers: [
        SyncController, // --> SYNCHRONIZES THE DB AND REDIS
    ],
})
export class AppModule implements OnModuleInit {
    constructor() {
    }

    async onModuleInit() {
    }
}

