import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectConnection, SequelizeModule } from '@nestjs/sequelize';
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

@Module({
    imports: [
        ConfigModule.forRoot(),
        SequelizeModule.forRootAsync({ useClass: SequelizeConfigService }),
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
    constructor(@InjectConnection() private readonly $sequelize: Sequelize) {
    }

    async onModuleInit() {
        await this.$sequelize.sync();
    }
}

