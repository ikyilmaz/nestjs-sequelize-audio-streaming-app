import { Controller, Param, Query } from '@nestjs/common';
import { UsersRelatedService } from './users-related.service';
import { SendResponse } from '../../../helpers/utils/send-response';
import { catchAsync } from '../../../helpers/utils/catch-async';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import {
    GetUserWithAlbumsQueryDto,
    GetUserWithProfileQueryDto,
    GetUserWithTracksQueryDto,
} from '../dto/user-query.dto';
import {
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { GetOperation } from '../../../decorators/operations/get.decorator';

@Controller('users')
@ApiTags('users')
export class UsersRelatedController {
    constructor(private $usersRelatedService: UsersRelatedService) {

    }

    /**
     * --> GET USER WITH ALBUMS BELONGS TO HIM
     * @description Returns user with albums belongs to him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: 'GET USER WITH ALBUMS BELONGS TO HIM' }) @GetOperation({ path: '/:id/albums-owned' })
    async getUserWithAlbumsOwned(@Param() params: ParamIdDto, @Query() query: GetUserWithAlbumsQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getUserWithAlbums(params.id, query, 'albumsOwned')));
    }

    /**
     * --> GET USER WITH ALBUMS FEATURING HIM
     * @description Returns user with albums featuring him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: 'GET USER WITH ALBUMS FEATURING HIM' }) @GetOperation({ path: '/:id/albums-participated' })
    async getUserWithAlbumsParticipated(@Param() params: ParamIdDto, @Query() query: GetUserWithAlbumsQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getUserWithAlbums(params.id, query, 'albumsParticipated')));
    }

    /**
     * --> GET USER WITH TRACKS BELONGS TO HIM
     * @description Returns user with tracks belongs to him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: 'GET USER WITH TRACKS BELONGS TO HIM' }) @GetOperation({ path: '/:id/tracks-owned' })
    async getUserWithTracksOwned(@Param() params: ParamIdDto, @Query() query: GetUserWithTracksQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getUserWithTracks(params.id, query, 'tracksOwned')));
    }

    /**
     * --> GET USER WITH TRACKS FEATURING HIM
     * @description Returns user with tracks featuring him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: 'GET USER WITH TRACKS FEATURING HIM' }) @GetOperation({ path: '/:id/tracks-participated' })
    async getUserWithTracksParticipated(@Param() params: ParamIdDto, @Query() query: GetUserWithTracksQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getUserWithTracks(params.id, query, 'tracksParticipated')));
    }

    /**
     * --> GET USER WITH PROFILE
     * @description Returns user with profile
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: 'GET USER WITH PROFILE' }) @GetOperation({ path: '/:id/profile' })
    async getUserWithProfile(@Param() params: ParamIdDto, @Query() query: GetUserWithProfileQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getUserWithProfile(params.id, query)));
    }
}
