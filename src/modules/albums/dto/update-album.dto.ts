import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateAlbumDto {
    @Length(0, 128, { message: 'field \'title\' must be between 0 and 128 characters' })
    @IsOptional()
    title!: string;

    photo?: string;
}