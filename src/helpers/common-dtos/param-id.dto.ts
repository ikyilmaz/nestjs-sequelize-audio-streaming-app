import { IsUUID } from 'class-validator';
import { ApiParam } from '@nestjs/swagger';

export class ParamIdDto {
    @IsUUID(4, { message: "param 'id' must be a uuid" })
    id: string;
}
