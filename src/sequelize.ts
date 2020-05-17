import User from './models/user/user.model';
import Track from './models/track/track.model';
import Album from './models/album/album.model';
import UserProfile from './models/user-profile/user-profile.model';
import Friendship from './models/m2m/friendship/friendship.model';
import FeaturingTrack from './models/m2m/featuring/featuring-track/featuring-track.model';
import FeaturingAlbum from './models/m2m/featuring/featuring-album/featuring-album.model';
import { Injectable } from '@nestjs/common';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';
import TrackComment from './models/comment/track-comment/track-comment.model';
import AlbumComment from './models/comment/album-comment/album-comment.model';
import Playlist from './models/playlist/playlist.model';
import TrackInThePlaylist from './models/m2m/track-in-the-playlist/track-in-the-playlist.model';
import Mood from './models/mood/mood.model';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
    createSequelizeOptions(): SequelizeModuleOptions {
        return {
            dialect: process.env.DB_DIALECT as 'mysql',
            username: process.env.DB_USER,
            database: process.env.DB_NAME,
            sync: { force: true },
            models: [
                User,
                Track,
                TrackComment,
                Album,
                AlbumComment,
                UserProfile,
                Friendship,
                Playlist,
                TrackInThePlaylist,
                Mood,

                // Many 2 Many
                FeaturingTrack,
                FeaturingAlbum,
            ],
        };
    }
}