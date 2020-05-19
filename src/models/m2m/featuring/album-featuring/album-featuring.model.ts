import { BaseModel } from '../../../base';
import { UUID } from 'sequelize';
import { AllowNull, BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import User from '../../../user/user.model';
import Album from '../../../album/album.model';

@Table({ timestamps: true, paranoid: true, tableName: 'AlbumFeaturing' })
export default class AlbumFeaturing extends BaseModel<AlbumFeaturing> {
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


