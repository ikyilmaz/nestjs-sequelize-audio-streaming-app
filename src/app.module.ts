import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';
import { AlbumsController } from './modules/albums/albums.controller';
import { AlbumsService } from './modules/albums/albums.service';
import { AlbumsModule } from './modules/albums/albums.module';
import User from './models/user/user.model';
import UserProfile from './models/user/user-profile/user-profile.model';
import UserTrack from './models/m2m/usertrack.model';
import UserAlbum from './models/m2m/useralbum.model';
import Track from './models/track/track.model';
import Album from './models/album/album.model';
import Friendship from './models/user/friendship/friendship.model';

@Module({
    imports: [
        ConfigModule.forRoot(),
        SequelizeModule.forRoot({
            dialect: process.env.DB_DIALECT as 'mysql',
            username: process.env.DB_USER,
            database: process.env.DB_NAME,
            sync: {force: true},
            retryDelay: 30,
            models: [
                User,
                Track,
                Album,
                UserProfile,
                Friendship,

                // Many 2 Many
                UserTrack,
                UserAlbum,
            ],
        }),
        UsersModule,
        AlbumsModule,
    ],
    controllers: [AlbumsController],
    providers: [AlbumsService],
})
export class AppModule {}
