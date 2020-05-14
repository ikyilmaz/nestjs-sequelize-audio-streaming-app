import { IsNumberString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginateQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumberString()
    page!: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumberString()
    limit!: number;
}