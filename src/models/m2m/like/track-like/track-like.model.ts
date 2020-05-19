import { BaseModel } from '../../../base';
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import User from '../../../user/user.model';
import Track from '../../../track/track.model';

@Table({ timestamps: false, tableName: 'TrackLikes' })
export default class TrackLike extends BaseModel<TrackLike> {
    // --> ASSOCIATIONS

    // --> TRACK

    /**@description album id*/
    @ForeignKey(() => Track)
    @AllowNull(false)
    @Column(DataType.UUID)
    trackId: string;

    /**@description track itself*/
    @BelongsTo(() => Track)
    track: Track;

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