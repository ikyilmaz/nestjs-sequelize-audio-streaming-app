import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length, Max } from 'class-validator';

export class UpdateCommentDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Length(1, 126)
    content: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Max(10000)
    second: number;
}