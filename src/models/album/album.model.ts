import { BaseModel } from '../base';
import {
    AllowNull,
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Length,
    Table,
} from 'sequelize-typescript';
import User from '../user/user.model';
import FeaturingAlbum from '../m2m/featuring/featuring-album/featuring-album.model';
import { albumScopes, defaultAlbumScope } from './album.scopes';
import Track from '../track/track.model';

@Table({
    timestamps: true,
    paranoid: true,
    defaultScope: defaultAlbumScope,
    scopes: albumScopes,
})
export default class Album extends BaseModel<Album> {
    /*** @description Album's Title */
    @Length({
        max: 128,
        msg: 'field \'firstName\' must be between 1 and 128 characters',
    })
    @AllowNull(false)
    @Column(DataType.STRING(128))
    title!: string;

    /**
     * @description Path to the album's photo
     * @default default.jpeg */
    @Default('default.jpeg')
    @Column(DataType.STRING)
    photo!: string;

    // ASSOCIATIONS

    // OWNER

    /*** @description User's id which one is owner of this track */
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    ownerId!: string;

    /*** @description User which one is owner of this track */
    @BelongsTo(() => User)
    owner!: User;

    // ARTISTS

    /*** @description Artists on the track */
    @BelongsToMany(() => User, {
        through: { model: () => FeaturingAlbum, unique: false },
    })
    artists!: User[];

    // TRACKS
    /*** @description Tracks in the album */
    @HasMany(() => Track)
    tracks!: Track[];
}
