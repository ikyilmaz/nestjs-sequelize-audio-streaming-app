import { Controller, Param, Query } from '@nestjs/common';
import { UsersRelatedService } from './users-related.service';
import { SendResponse } from '../../../helpers/utils/send-response';
import { catchAsync } from '../../../helpers/utils/catch-async';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOperation } from '../../../decorators/operations/get.decorator';
import { GetOneQueryDto } from 'src/helpers/common-dtos/common-query.dto';

@Controller('users')
@ApiTags('users')
export class UsersRelatedController {
    constructor(private $usersRelatedService: UsersRelatedService) {}

    /**
     * --> GET USER'S ALBUMS BELONGS TO HIM
     * @description Returns user's albums belongs to him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: "GET USER'S ALBUMS BELONGS TO HIM" })
    @GetOperation({ path: '/:id/albums-owned' })
    async getAlbumsOwned(@Param() params: ParamIdDto, @Query() query: GetOneQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getAlbums(params.id, query, 'albumsOwned')));
    }

    /**
     * --> GET USER'S ALBUMS FEATURING HIM
     * @description Returns user's albums featuring him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: "GET USER'S ALBUMS FEATURING HIM" })
    @GetOperation({ path: '/:id/albums-participated' })
    async getAlbumsParticipated(@Param() params: ParamIdDto, @Query() query: GetOneQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getAlbums(params.id, query, 'albumsParticipated')));
    }

    /**
     * --> GET USER'S TRACKS BELONGS TO HIM
     * @description Returns user's tracks belongs to him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: "GET USER'S TRACKS BELONGS TO HIM" })
    @GetOperation({ path: '/:id/tracks-owned' })
    async getTracksOwned(@Param() params: ParamIdDto, @Query() query: GetOneQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getTracks(params.id, query, 'tracksOwned')));
    }

    /**
     * --> GET USER'S TRACKS FEATURING HIM
     * @description Returns user's tracks featuring him
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: "GET USER'S TRACKS FEATURING HIM" })
    @GetOperation({ path: '/:id/tracks-participated' })
    async getTracksParticipated(@Param() params: ParamIdDto, @Query() query: GetOneQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getTracks(params.id, query, 'tracksParticipated')));
    }

    /**
     * --> GET USER'S PROFILE
     * @description Returns user's profile
     * @statusCodes 200, 400, 404 */
    @ApiOperation({ summary: "GET USER'S PROFILE" })
    @GetOperation({ path: '/:id/profile' })
    async getProfile(@Param() params: ParamIdDto, @Query() query: GetOneQueryDto) {
        return SendResponse(await catchAsync(this.$usersRelatedService.getProfile(params.id, query)));
    }
}
