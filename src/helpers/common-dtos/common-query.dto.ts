import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetOneQueryDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional({})
    fields!: string;
}

export class GetManyQueryDto extends GetOneQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumberString()
    page!: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumberString()
    limit!: number;
}
