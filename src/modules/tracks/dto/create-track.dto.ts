import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateTrackDto {
    @Length(1, 128, { message: 'field \'title\' must be between 1 and 128 characters' })
    @IsString({ message: 'field \'title\' must be string' })
    @IsNotEmpty()
    title!: string;

    @IsNotEmpty()
    @IsUUID()
    albumId!: string;
}