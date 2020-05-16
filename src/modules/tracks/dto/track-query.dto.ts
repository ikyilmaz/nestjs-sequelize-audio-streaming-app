import { GetManyQueryDto, GetOneQueryDto } from '../../../helpers/common-dtos/common-query.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetManyTrackQueryDto extends GetManyQueryDto {
    @IsOptional()
    title: string;

    @IsUUID()
    @IsOptional()
    ownerId: string;
}

export class GetOneTrackQueryDto extends GetOneQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    ownerFields: string;

    @ApiProperty({ required: false })
    @IsOptional()
    artistFields: string;

    @ApiProperty({ required: false })
    @IsOptional()
    albumFields: string;
}