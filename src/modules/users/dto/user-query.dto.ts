import { GetManyQueryDto, GetOneQueryDto } from '../../../helpers/common-dtos/common-query.dto';
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


export class GetUserWithAlbumsQueryDto extends GetOneQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    albumFields: string;
}

export class GetUserWithTracksQueryDto extends GetOneQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    trackFields: string;
}