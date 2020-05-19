import { BaseModel } from '../../base';
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Length, Table } from 'sequelize-typescript';
import User from '../../user/user.model';
import Album from '../../album/album.model';

@Table({ timestamps: true, paranoid: true, tableName: 'AlbumComments' })
export default class AlbumComment extends BaseModel<AlbumComment>{
    /**@description content of the comment*/
    @Length({ min: 1, max: 255, msg: 'field \'content\' must be between 1 and 255 characters' })
    @AllowNull(false)
    @Column(DataType.STRING)
    content: string;

    // --> ASSOCIATIONS

    // --> ALBUM

    /**@description album id*/
    @ForeignKey(() => Album)
    @AllowNull(false)
    @Column(DataType.UUID)
    albumId: string;

    /**@description* album itself*/
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