import { BaseModel } from '../base';
import { AllowNull, BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import User from '../user/user.model';
import { UUID } from 'sequelize';
import Track from '../track/track.model';

@Table({ timestamps: true, paranoid: true, tableName: 'users_tracks' })
export default class UserTrack extends BaseModel<UserTrack> {
    /***@description User id */
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(UUID)
    artistId!: string;

    /***@description Track id */
    @ForeignKey(() => Track)
    @AllowNull(false)
    @Column(UUID)
    trackId!: string;

    /***@description User which one is associated */
    @BelongsTo(() => User)
    artist!: User;

    /***@description Track which one is associated */
    @BelongsTo(() => Track)
    track!: Track;
}
