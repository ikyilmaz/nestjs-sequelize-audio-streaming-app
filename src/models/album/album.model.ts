import { BaseModel } from '../base';
import { STRING, UUID, JSON } from 'sequelize';
import {
    AllowNull,
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey,
    Length,
    Table,
} from 'sequelize-typescript';
import User from '../user/user.model';
import UserAlbum from '../m2m/useralbum.model';
import { albumScopes, defaultAlbumScope } from './album.scopes';

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
        msg: "field 'firstName' must be between 1 and 128 characters",
    })
    @AllowNull(false)
    @Column(STRING(128))
    title!: string;

    /**
     * @description Path to the album's photo
     * @default default.jpeg */
    @Default('default.jpeg')
    @Column(DataType.STRING)
    photo!: string;

    /*** @description User's id which one is owner of this track */
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(UUID)
    ownerId!: string;

    /*** @description User which one is owner of this track */
    @BelongsTo(() => User)
    owner!: User;

    /*** @description Artists on the track */
    @BelongsToMany(() => User, {
        through: { model: () => UserAlbum, unique: false },
    })
    artists!: User[];
}
