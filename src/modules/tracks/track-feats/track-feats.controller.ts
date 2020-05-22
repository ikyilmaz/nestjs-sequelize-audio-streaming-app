import { Body, Controller, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../../decorators/auth.decorator';
import Track from '../../../models/track/track.model';
import { CreateOperation } from '../../../decorators/operations/create.decorator';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { AddArtistsDto } from '../../albums/albums-related/dto/add-artists.dto';
import { SendResponse } from '../../../helpers/utils/send-response';
import { catchAsync } from '../../../helpers/utils/catch-async';
import { DeleteOperation } from '../../../decorators/operations/delete.decorator';
import { RemoveArtistsDto } from '../../albums/albums-related/dto/remove-artists.dto';
import { TrackFeatsService } from './track-feats.service';

@Controller('tracks')
@ApiTags("tracks")
export class TrackFeatsController {
    constructor(private readonly $trackFeatsService: TrackFeatsService,) {

    }

    /**
     * --> ADD MANY ARTIST TO TRACK
     * @description Adds artists to specified track
     * @permissions authenticated users, owners
     * @statusCodes 201, 400, 404 */
    @ApiOperation({ summary: 'ADD MANY ARTIST' }) @Auth({ isOwner: Track }) @CreateOperation('/:id/artists')
    async addManyArtist(@Param() params: ParamIdDto, @Body() addArtistsDto: AddArtistsDto) {
        return SendResponse(await catchAsync(this.$trackFeatsService.addArtists(params.id, addArtistsDto)));
    }

    /**
     * --> REMOVE MANY ARTIST FROM TRACK
     * @description Removes artists from specified track
     * @permissions authenticated users, owners
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'REMOVE MANY ARTIST' }) @Auth({ isOwner: Track }) @DeleteOperation('/:id/artists')
    async removeManyArtist(@Param() params: ParamIdDto, @Body() removeArtistsDto: RemoveArtistsDto) {
        await catchAsync(this.$trackFeatsService.removeArtists(params.id, removeArtistsDto));
    }
}
