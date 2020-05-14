import {  IsNotEmpty,  Length } from 'class-validator';

export class CreateAlbumDto {
    @Length(0, 128, { message: 'field \'title\' must be between 0 and 128 characters' })
    @IsNotEmpty()
    title!: string;

    photo?: string;
}