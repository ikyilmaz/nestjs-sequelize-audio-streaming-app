import { Table, Model, Column, ForeignKey, BelongsTo, DataType, Length } from 'sequelize-typescript';
import User from '../user/user.model';
import Mood from '../mood/mood.model';

@Table({ timestamps: true, paranoid: true, tableName: 'user_profile' })
export default class UserProfile extends Model<UserProfile> {
    /** @description User id which one is owner of this profile also primary key */
    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    /** @description User's biography, optional */
    @Length({
        min: 0,
        max: 255,
        msg: 'field \'biography\' must be between 0 and 255 characters',
    })
    @Column(DataType.STRING)
    biography!: string;

    // --> ASSOCIATIONS

    // --> MOOD

    /** @description mood id*/
    @ForeignKey(() => Mood)
    @Column(DataType.UUID)
    moodId: string;

    @BelongsTo(() => Mood)
    mood: Mood;

    // --> OWNER (USER)

    /** @description which user is owner of this profile */
    @BelongsTo(() => User)
    owner!: User;
}
