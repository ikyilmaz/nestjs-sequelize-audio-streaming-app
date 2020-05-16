import { GetManyQueryDto, GetOneQueryDto } from '../../../helpers/common-dtos/common-query.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetManyAlbumQueryDto extends GetManyQueryDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    ownerId: string;
}

export class GetOneAlbumQueryDto extends GetOneQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    ownerFields: string;

    @ApiProperty({ required: false })
    @IsOptional()
    artistFields: string;

    @ApiProperty({ required: false })
    @IsOptional()
    trackFields: string;
}