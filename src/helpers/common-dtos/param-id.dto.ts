import { IsUUID } from 'class-validator';

export class ParamIdDto {
    @IsUUID(4, { message: 'param \'id\' must be a uuid' })
    id: string;
}
