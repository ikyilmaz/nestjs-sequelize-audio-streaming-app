import User from './models/user/user.model';
import Track from './models/track/track.model';
import Album from './models/album/album.model';
import UserProfile from './models/user/user-profile/user-profile.model';
import Friendship from './models/user/friendship/friendship.model';
import UserTrack from './models/m2m/usertrack.model';
import UserAlbum from './models/m2m/useralbum.model';
import { Injectable } from '@nestjs/common';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
    createSequelizeOptions(): SequelizeModuleOptions {
        return {

            dialect: process.env.DB_DIALECT as 'mysql',
            username: process.env.DB_USER,
            database: process.env.DB_NAME,
            sync: { force: true, logging: true },
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
        };
    }
}