import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel, SequelizeModule } from '@nestjs/sequelize';
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
import { Sequelize } from 'sequelize-typescript';
import User from './models/user/user.model';
import UserProfile from './models/user-profile/user-profile.model';
import Album from './models/album/album.model';
import Track from './models/track/track.model';
import TrackLike from './models/m2m/like/track-like/track-like.model';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SequelizeModule.forRootAsync({ useClass: SequelizeConfigService }),
        SequelizeModule.forFeature([User, UserProfile, Album, Track, TrackLike]), // Sync Controller
        RedisModule.register(redisModuleOptions),
        UsersModule,
        AlbumsModule,
        AuthModule,
        CurrentUserRequestModule,
        CurrentUserModule,
        TokenModule,
        TracksModule,
    ],
    controllers: [SyncController],
})
export class AppModule implements OnModuleInit {
    constructor() {
    }

    async onModuleInit() {
    }
}

