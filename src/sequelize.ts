import User from './models/user/user.model';
import Track from './models/track/track.model';
import Album from './models/album/album.model';
import UserProfile from './models/user-profile/user-profile.model';
import Friendship from './models/m2m/friendship/friendship.model';
import TrackFeaturing from './models/m2m/featuring/track-featuring/track-featuring.model';
import AlbumFeaturing from './models/m2m/featuring/album-featuring/album-featuring.model';
import { Injectable } from '@nestjs/common';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';
import TrackComment from './models/comment/track-comment/track-comment.model';
import AlbumComment from './models/comment/album-comment/album-comment.model';
import Playlist from './models/playlist/playlist.model';
import TrackPlaylist from './models/m2m/track-playlist/track-playlist.model';
import Mood from './models/mood/mood.model';
import TrackLike from './models/m2m/like/track-like/track-like.model';
import AlbumLike from './models/m2m/like/album-like/album-like.model';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
    createSequelizeOptions(): SequelizeModuleOptions {
        return {
            dialect: process.env.DB_DIALECT as 'postgres',
            username: process.env.DB_USER,
            database: process.env.DB_NAME,
            sync: { force: true },
            models: [
                User,
                Friendship,

                Track,
                TrackComment,
                TrackLike,
                Playlist,
                TrackPlaylist,

                Album,
                AlbumComment,                                 // dewam ke
                AlbumLike,

                UserProfile,
                Mood,

                // Many 2 Many
                TrackFeaturing,
                AlbumFeaturing,
            ],
        };
    }
}