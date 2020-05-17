import { BaseModel } from '../base';
import { AllowNull, Column, DataType, Table } from 'sequelize-typescript';

@Table({ timestamps: true, paranoid: true })
export default class Mood extends BaseModel<Mood> {
    @Column(DataType.STRING)
    emoji: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    mood: string;
}