import { BaseModel } from '../../base';
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Length, Table } from 'sequelize-typescript';
import Track from '../../track/track.model';
import User from '../../user/user.model';

@Table({ timestamps: true, paranoid: true, tableName: 'TrackComments' })
export default class TrackComment extends BaseModel<TrackComment> {
    /**@description content of the comment*/
    @Length({ min: 1, max: 255, msg: 'field \'content\' must be between 1 and 255 characters' })
    @AllowNull(false)
    @Column(DataType.STRING)
    content: string;

    /**@description */
    @Column(DataType.SMALLINT)
    minuteOfTheMusic: number;

    // --> ASSOCIATIONS

    // --> TRACK

    /**@description track id*/
    @ForeignKey(() => Track)
    @AllowNull(false)
    @Column(DataType.UUID)
    trackId: string;

    /**@description* track itself*/
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