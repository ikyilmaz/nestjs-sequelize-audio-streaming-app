import { GetManyQueryDto } from '../../../helpers/common-dtos/common-query.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class GetManyTrackQueryDto extends GetManyQueryDto {
    @IsOptional()
    title: string;

    @IsUUID()
    @IsOptional()
    ownerId: string;
}