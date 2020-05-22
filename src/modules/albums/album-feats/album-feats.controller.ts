import { Body, Controller, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../../decorators/auth.decorator';
import Album from '../../../models/album/album.model';
import { CreateOperation } from '../../../decorators/operations/create.decorator';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { catchAsync } from '../../../helpers/utils/catch-async';
import { AlbumFeatsService } from './album-feats.service';
import { AddArtistsDto } from './dto/add-artists.dto';
import { RemoveArtistsDto } from './dto/remove-artists.dto';

@Controller('albums')
@ApiTags("albums")
export class AlbumFeatsController {

    constructor(private readonly $albumFeatsService: AlbumFeatsService) {

    }

    /**
     * --> ADD MANY ARTIST TO ALBUM
     * @description Adds artists to specified album
     * @permissions authenticated users, owners
     * @statusCodes 201, 400, 404 */
    @ApiOperation({ summary: 'ADD MANY ARTIST TO ALBUM' }) @Auth({ isOwner: Album }) @CreateOperation('/:id/artists')
    async addArtists(@Param() params: ParamIdDto, @Body() addArtistsDto: AddArtistsDto) {
        await catchAsync(this.$albumFeatsService.addArtists(params.id, addArtistsDto));
    }

    /**
     * --> REMOVE MANY ARTIST FROM ALBUM
     * @description Removes artists from specified album
     * @permissions authenticated users, owners
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'REMOVE MANY ARTIST FROM ALBUM' }) @Auth({ isOwner: Album }) @Delete('/:id/artists')
    async removeArtists(@Param() params: ParamIdDto, @Body() removeArtistsDto: RemoveArtistsDto) {
        await catchAsync(this.$albumFeatsService.removeArtists(params.id, removeArtistsDto));
    }
}
