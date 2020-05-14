import { Table, Model, Column, ForeignKey, BelongsTo, DataType, Length } from 'sequelize-typescript';
import { UUID, UUIDV4 } from 'sequelize';
import User from '../user.model';

@Table({ timestamps: true, paranoid: true, tableName: 'user_profile' })
export default class UserProfile extends Model<UserProfile> {
    /*** @description User id which one is owner of this profile also primary key */
    @ForeignKey(() => User)
    @Column({ type: UUID, primaryKey: true })
    id!: string;

    /*** @description User's biography, optional */
    @Length({ min: 0, max: 255, msg: 'field \'biography\' must be between 0 and 255 characters' })
    @Column(DataType.STRING)
    biography!: string;

    // ASSOCIATIONS

    // OWNER (USER)

    /*** @description User which one is owner of this profile */
    @BelongsTo(() => User)
    owner!: User;
}