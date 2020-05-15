import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { AuthModule } from './modules/auth/auth.module';
import { CurrentUserModule } from '@app/current-user';
import { TokenModule } from '@app/token';
import { TracksModule } from './modules/tracks/tracks.module';
import { SequelizeConfigService } from './sequelize';
import { SyncController } from './helpers/sync/sync.controller';

@Module({
    imports: [
        ConfigModule.forRoot(),
        SequelizeModule.forRootAsync({ useClass: SequelizeConfigService }),
        UsersModule,
        AlbumsModule,
        AuthModule,
        CurrentUserModule,
        TokenModule,
        TracksModule
    ],
    controllers: [SyncController]
})
export class AppModule {}
