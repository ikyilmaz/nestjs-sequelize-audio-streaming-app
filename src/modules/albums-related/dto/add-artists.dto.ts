import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ArtistDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    id: string;
}

export class AddArtistsDto {
    @ApiProperty()
    @ValidateNested({ each: true })
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayNotEmpty()
    @Type(() => ArtistDto)
    artists: ArtistDto[];
}