import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackDto {
    @ApiProperty({ required: false })
    @Length(1, 128, { message: 'field \'title\' must be between 1 and 128 characters' })
    @IsString({ message: 'field \'title\' must be string' })
    @IsOptional()
    title!: string;

}