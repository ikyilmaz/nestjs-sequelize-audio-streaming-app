import { Module } from '@nestjs/common';
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

@Module({
    imports: [
        ConfigModule.forRoot(),
        SequelizeModule.forRootAsync({ useClass: SequelizeConfigService }),
        UsersModule,
        AlbumsModule,
        AuthModule,
        CurrentUserRequestModule,
        CurrentUserModule,
        TokenModule,
        TracksModule
    ],
    controllers: [SyncController]
})
export class AppModule {}
