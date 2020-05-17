import { GetManyQueryDto } from '../../../helpers/common-dtos/common-query.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetManyUserQueryDto extends GetManyQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    firstName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    lastName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    username: string;
}
