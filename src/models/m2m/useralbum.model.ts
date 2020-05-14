import { BaseModel } from '../base';
import { UUID } from 'sequelize';
import {
    AllowNull,
    BelongsTo,
    Column,
    ForeignKey,
    Table,
} from 'sequelize-typescript';
import User from '../user/user.model';
import Album from '../album/album.model';

@Table({ timestamps: true, paranoid: true, tableName: 'users_albums' })
export default class UserAlbum extends BaseModel<UserAlbum> {
    /*** @description User id */
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(UUID)
    artistId!: string;

    /*** @description Album id */
    @ForeignKey(() => Album)
    @AllowNull(false)
    @Column(UUID)
    albumId!: string;

    /*** @description User which one is associated */
    @BelongsTo(() => User)
    artist!: User;

    /*** @description Album which one is associated */
    @BelongsTo(() => Album)
    album!: Album;
}
