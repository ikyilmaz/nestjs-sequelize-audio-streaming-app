import {
    AllowNull,
    BeforeSave,
    BeforeUpdate,
    BelongsToMany,
    Column,
    DataType,
    Default,
    HasMany,
    HasOne,
    Is,
    IsEmail,
    Length,
    Table,
    Unique,
} from 'sequelize-typescript';
import { STRING, SaveOptions, UpdateOptions } from 'sequelize';
import { BaseModel } from '../base';
import { hash } from 'bcryptjs';
import Album from '../album/album.model';
import FeaturingAlbum from '../m2m/featuring/featuring-album/featuring-album.model';
import Track from '../track/track.model';
import FeaturingTrack from '../m2m/featuring/featuring-track/featuring-track.model';
import Friendship from '../m2m/friendship/friendship.model';
import { userScopes } from './user.scopes';
import UserProfile from '../user-profile/user-profile.model';
import TrackComment from '../comment/track-comment/track-comment.model';
import AlbumComment from '../comment/album-comment/album-comment.model';
import Playlist from '../playlist/playlist.model';
import TrackInThePlaylist from '../m2m/track-in-the-playlist/track-in-the-playlist.model';

@Table({
    timestamps: true,
    paranoid: true,
    scopes: userScopes,
})
export default class User extends BaseModel<User> {
    /** @description User's first name, not required */
    @Length({
        min: 2,
        max: 32,
        msg: 'field \'firstName\' must be between 2 and 32 characters',
    })
    @Column(STRING(32))
    firstName!: string;

    /** @description User's last name, not required */
    @Length({
        min: 2,
        max: 32,
        msg: 'field \'lastName\' must be between 2 and 32 characters',
    })
    @Column(STRING(32))
    lastName!: string;

    /** @description User's username, must be unique */
    @Is({
        args: /^[a-z0-9_]{2,32}$/,
        msg: 'field \'username\' must be a valid username',
    })
    @Unique
    @AllowNull(false)
    @Column(STRING(32))
    username!: string;

    /** @description User's email, must be unique */
    @IsEmail
    @Unique
    @AllowNull(false)
    @Column(STRING(64))
    email!: string;

    /** @description User's password */
    @AllowNull(false)
    @Column(STRING(128))
    password!: string;

    /**
     *  @description User's role
     *  @default user */
    @Default('user')
    @Column(DataType.ENUM('admin', 'moderator', 'user'))
    role!: string;

    /**
     * @description Path to the user's photo
     * @default default.jpeg */
    @Default('default.jpeg')
    @Column(STRING(128))
    photo!: string;

    /** @description takes timestamps when the password changes  */
    @Column
    passwordChangedAt!: Date;

    // --> ASSOCIATIONS

    // --> PROFILE

    /** @description User's profile */
    @HasOne(() => UserProfile)
    profile!: UserProfile;

    // --> ALBUMS

    /** @description User's albums */
    @HasMany(() => Album, { foreignKey: 'ownerId' })
    albumsOwned!: Album[];

    /** @description Albums which ones are participated by user */
    @BelongsToMany(() => Album, {
        through: { model: () => FeaturingAlbum, unique: false },
    })
    albumsParticipated!: Album[];

    // --> TRACKS

    /** @description User's tracks*/
    @HasMany(() => Track)
    tracksOwned!: Track;

    /** @description Tracks participated by user */
    @BelongsToMany(() => Track, {
        through: { model: () => FeaturingTrack, unique: false },
    })
    tracksParticipated!: Track[];

    // --> FRIENDS

    /** @description User's friends (users following by the current user) */
    @BelongsToMany(() => User, {
        through: { model: () => Friendship, unique: false },
        foreignKey: 'friendId',
    })
    friends!: User[];

    // --> FOLLOWERS

    /** @description User's followers (users following to the current user)*/
    @BelongsToMany(() => User, {
        through: { model: () => Friendship, unique: false },
        foreignKey: 'ownerId',
    })
    followers!: User[];

    // --> TRACK COMMENTS

    /** @description Track comments*/
    @HasMany(() => TrackComment)
    trackComments: TrackComment[];

    // --> ALBUM COMMENTS

    /** @description Album comments */
    @HasMany(() => AlbumComment)
    albumComments: AlbumComment[];

    // --> PLAYLISTS

    /** @description Playlists */
    @HasMany(() => Playlist)
    playlists: Playlist[];

    // -->  OWNER OF THE TRACKS IN PLAYLISTS

    /** @description mind fuck */
    @HasMany(() => TrackInThePlaylist)
    tracksInPlaylists: TrackInThePlaylist[];

    // --> HOOKS

    /** @description Hook for hashing the password before save */
    @BeforeSave({ name: 'hash-password-before-save' })
    static async hashPasswordBeforeSave(user: User, _: SaveOptions) {
        user.password = await hash(user.password, 12);
    }

    /** @description Hook for hashing the password if it exists before update */
    @BeforeUpdate({ name: 'hash-password-before-update' })
    static async hashPasswordBeforeUpdate(user: User, _: UpdateOptions) {
        if (user.password) user.password = await hash(user.password, 12);
    }
}
