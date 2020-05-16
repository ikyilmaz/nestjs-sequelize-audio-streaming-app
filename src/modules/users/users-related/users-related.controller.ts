import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersRelatedService } from './users-related.service';
import { SendResponse } from '../../../helpers/utils/send-response';
import { catchAsync } from '../../../helpers/utils/catch-async';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { GetUserWithAlbumsQueryDto, GetUserWithTracksQueryDto } from '../dto/user-query.dto';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersRelatedController {
    constructor(private $usersRelatedService: UsersRelatedService) {

    }

    /**
     * --> GET USER WITH ALBUMS BELONGS TO HIM
     * @description Returns user with albums belongs to him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: 'GET USER WITH ALBUMS BELONGS TO HIM' })
    @ApiOkResponse({ description: 'User found.' })
    @ApiBadRequestResponse({description: "Validation failed."})
    @ApiNotFoundResponse({description: "Not found any user."})
    @ApiParam({ name: 'id', type: 'UUID' })
    @Get('/:id/albums-owned')
    async getUserWithAlbumsOwned(@Param() params: ParamIdDto, @Query() query: GetUserWithAlbumsQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getUserWithAlbums(params.id, query, 'albumsOwned')));
    }

    /**
     * --> GET USER WITH ALBUMS FEATURING HIM
     * @description Returns user with albums featuring him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: 'GET USER WITH ALBUMS FEATURING HIM' })
    @ApiOkResponse({ description: 'User found.' })
    @ApiBadRequestResponse({description: "Validation failed."})
    @ApiNotFoundResponse({description: "Not found any user."})
    @ApiParam({ name: 'id', type: 'UUID' })
    @Get('/:id/albums-participated')
    async getUserWithAlbumsParticipated(@Param() params: ParamIdDto, @Query() query: GetUserWithAlbumsQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getUserWithAlbums(params.id, query, 'albumsParticipated')));
    }

    /**
     * --> GET USER WITH TRACKS BELONGS TO HIM
     * @description Returns user with tracks belongs to him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: 'GET USER WITH TRACKS BELONGS TO HIM' })
    @ApiOkResponse({ description: 'User found.' })
    @ApiBadRequestResponse({description: "Validation failed."})
    @ApiNotFoundResponse({description: "Not found any user."})
    @ApiParam({ name: 'id', type: 'UUID' })
    @Get('/:id/tracks-owned')
    async getUserWithTracksOwned(@Param() params: ParamIdDto, @Query() query: GetUserWithTracksQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getUserWithTracks(params.id, query, 'tracksOwned')));
    }

    /**
     * --> GET USER WITH TRACKS FEATURING HIM
     * @description Returns user with tracks featuring him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: 'GET USER WITH TRACKS FEATURING HIM' })
    @ApiOkResponse({ description: 'User found.' })
    @ApiBadRequestResponse({description: "Validation failed."})
    @ApiNotFoundResponse({description: "Not found any user."})
    @ApiParam({ name: 'id', type: 'UUID' })
    @Get('/:id/tracks-participated')
    async getUserWithTracksParticipated(@Param() params: ParamIdDto, @Query() query: GetUserWithTracksQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getUserWithTracks(params.id, query, 'tracksParticipated')));
    }
}
