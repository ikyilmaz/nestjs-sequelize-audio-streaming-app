import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { GetOneQueryDto } from '../../../helpers/common-dtos/common-query.dto';

export class GetCurrentUserQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    fields!: string;
}

export class GetCurrentUsersAlbumsQueryDto extends GetOneQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    title: string;
}

export class GetCurrentUsersTracksQueryDto extends GetOneQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    title: string;

    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    albumId: string;
}