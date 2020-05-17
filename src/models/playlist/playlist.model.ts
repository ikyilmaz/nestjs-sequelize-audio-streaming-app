import { BaseModel } from '../base';
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Length, Table } from 'sequelize-typescript';
import User from '../user/user.model';
import { PlaylistPrivacy } from './playlist-enums';

@Table({ timestamps: true, paranoid: true })
export default class Playlist extends BaseModel<Playlist> {
    /**@description title of the playlist*/
    @Length({ min: 1, max: 255, msg: 'field \'title\' must be between 1 and 255 characters' })
    @AllowNull(false)
    @Column(DataType.STRING)
    title: string;

    /**@description photo of the playlist*/
    @Column(DataType.STRING)
    photo: string;

    @Column(DataType.ENUM(...Object.keys(PlaylistPrivacy)))
    privacy: PlaylistPrivacy;

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