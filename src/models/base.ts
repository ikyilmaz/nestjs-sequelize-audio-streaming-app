import { UUID, UUIDV4 } from 'sequelize';
import { Column, Model } from 'sequelize-typescript';

export class BaseModel<T> extends Model<T> {
    @Column({ type: UUID, primaryKey: true, defaultValue: UUIDV4 })
    id!: string;
}
