import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
    @ApiProperty({ required: true })
    @Length(1, 128, { message: 'field \'title\' must be between 1 and 128 characters' })
    @IsString({ message: 'field \'title\' must be string' })
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ required: true, type: 'UUID' })
    @IsNotEmpty()
    @IsUUID()
    albumId!: string;
}