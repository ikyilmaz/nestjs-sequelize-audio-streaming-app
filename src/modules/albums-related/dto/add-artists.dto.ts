import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ArtistDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}

export class AddArtistsDto {
    @ValidateNested({ each: true })
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayNotEmpty()
    @Type(() => ArtistDto)
    artists: ArtistDto[];
}