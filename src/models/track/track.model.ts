import { BaseModel } from '../base';
import {
    AllowNull,
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Length,
    Table,
} from 'sequelize-typescript';
import Album from '../album/album.model';
import User from '../user/user.model';
import FeaturingTrack from '../m2m/featuring/featuring-track/featuring-track.model';
import TrackComment from '../comment/track-comment/track-comment.model';

@Table({ timestamps: true, paranoid: true })
export default class Track extends BaseModel<Track> {
    /** @description Track's Title */
    @Length({
        min: 1,
        max: 128,
        msg: 'field \'title\' must be between 1 and 128 characters',
    })
    @AllowNull(false)
    @Column(DataType.STRING(128))
    title!: string;

    /** @description Path to the track's file */
    @AllowNull(false)
    @Column(DataType.STRING)
    track!: string;

    /** @description Duration of the track */
    @AllowNull(false)
    @Column(DataType.SMALLINT)
    duration!: number;

    /** @description Album's id which one is includes that track */
    @ForeignKey(() => Album)
    @AllowNull(false)
    @Column(DataType.UUID)
    albumId!: string;

    /** @description Album which one is includes that track */
    @BelongsTo(() => Album)
    album!: Album;

    // --> ASSOCIATIONS

    // --> OWNER (USER)

    /** @description User's id which one is owner of this track */
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    ownerId!: string;

    /** @description User which one is owner of this track */
    @BelongsTo(() => User)
    owner!: User;

    // --> ARTISTS (USERS)

    /** @description Users on the album */
    @BelongsToMany(() => User, {
        through: { model: () => FeaturingTrack, unique: false },
    })
    artists!: User[];

    // --> COMMENTS

    /** @description comments on the track */
    @HasMany(() => TrackComment)
    comments: TrackComment[];
}
