import { IsNotEmpty, IsOptional, Length, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(1, 128)
    content: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Max(10000)
    second: number;
}