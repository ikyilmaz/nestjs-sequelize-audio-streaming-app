import { BaseModel } from '../../../base';
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import Album from '../../../album/album.model';
import User from '../../../user/user.model';

@Table({ timestamps: false, tableName: 'AlbumLikes' })
export default class AlbumLike extends BaseModel<AlbumLike> {
    // --> ASSOCIATIONS

    // --> ALBUM

    /**@description album id*/
    @ForeignKey(() => Album)
    @AllowNull(false)
    @Column(DataType.UUID)
    albumId: string;

    /**@description album itself*/
    @BelongsTo(() => Album)
    album: Album;

    // --> OWNER (USER)

    /**@description owner id*/
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    ownerId: string;

    /**@description* owner itself*/
    @BelongsTo(() => User)
    owner: User;
}