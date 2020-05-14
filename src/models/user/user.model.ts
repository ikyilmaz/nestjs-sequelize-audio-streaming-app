import {
    AllowNull,
    BeforeSave,
    BeforeUpdate,
    BelongsToMany,
    Column,
    Default,
    HasMany,
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
import UserAlbum from '../m2m/useralbum.model';
import Track from '../track/track.model';
import UserTrack from '../m2m/usertrack.model';
import Friendship from './friendship/friendship.model';
import { userScopes } from './user.scopes';

@Table({
    timestamps: true,
    paranoid: true,
    scopes: userScopes,
})
export default class User extends BaseModel<User> {
    /*** @description User's first name, not required */
    @Length({
        min: 2,
        max: 32,
        msg: "field 'firstName' must be between 2 and 32 characters",
    })
    @Column(STRING(32))
    firstName!: string;

    /*** @description User's last name, not required */
    @Length({
        min: 2,
        max: 32,
        msg: "field 'lastName' must be between 2 and 32 characters",
    })
    @Column(STRING(32))
    lastName!: string;

    /*** @description User's username, must be unique */
    @Is({
        args: /^[a-z0-9_]{2,32}$/,
        msg: "field 'username' must be a valid username",
    })
    @Unique
    @AllowNull(false)
    @Column(STRING(32))
    username!: string;

    /*** @description User's email, must be unique */
    @IsEmail
    @Unique
    @AllowNull(false)
    @Column(STRING(64))
    email!: string;

    /*** @description User's password */
    @AllowNull(false)
    @Column(STRING(128))
    password!: string;

    /**
     * @description Path to the user's photo
     * @default default.jpeg */
    @Default('default.jpeg')
    @Column(STRING(128))
    photo!: string;

    // ASSOCIATIONS

    // ALBUMS

    /*** @description User's albums */
    @HasMany(() => Album, { foreignKey: 'ownerId' })
    albumsOwned!: Album[];

    /***@description Albums which ones are participated by user */
    @BelongsToMany(() => Album, {
        through: { model: () => UserAlbum, unique: false },
    })
    albumsParticipated!: Album[];

    // TRACKS

    /***@description User's tracks*/
    @HasMany(() => Track)
    tracksOwned!: Track;

    /***@description Tracks participated by user */
    @BelongsToMany(() => Track, {
        through: { model: () => UserTrack, unique: false },
    })
    tracksParticipated!: Track[];

    // FRIENDS

    /***@description User's friends (users following by the current user) */
    @BelongsToMany(() => User, {
        through: { model: () => Friendship, unique: false },
        foreignKey: 'friendId',
    })
    friends!: User[];

    // FOLLOWERS

    /***@description User's followers (users following to the current user)*/
    @BelongsToMany(() => User, {
        through: { model: () => Friendship, unique: false },
        foreignKey: 'ownerId',
    })
    followers!: User[];

    // HOOKS

    /***@description Hook for hashing the password before save */
    @BeforeSave({ name: 'hash-password-before-save' })
    static async hashPasswordBeforeSave(user: User, options: SaveOptions) {
        user.password = await hash(user.password, 12);
    }

    /***@description Hook for hashing the password if it exists before update */
    @BeforeUpdate({ name: 'hash-password-before-update' })
    static async hashPasswordBeforeUpdate(user: User, options: UpdateOptions) {
        if (user.password) user.password = await hash(user.password, 12);
    }
}
