import { GetManyQueryDto } from '../../../helpers/common-dtos/common-query.dto';
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