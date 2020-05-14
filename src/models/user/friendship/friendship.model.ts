import { BaseModel } from '../../base';
import { AllowNull, BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import User from '../user.model';
import { UUID } from 'sequelize';

@Table({ timestamps: true, updatedAt: false })
export default class Friendship extends BaseModel<Friendship> {
    /***@description Owner (user) id of this friendship (follower) */
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(UUID)
    ownerId!: string;

    /***@description Friend (user) id of this friendship (following) */
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(UUID)
    friendId!: string;

    /***@description Owner (user) which one is associated */
    @BelongsTo(() => User)
    owner!: User;

    /***@description Friend (user) which one is associated */
    @BelongsTo(() => User)
    friend!: User;
}