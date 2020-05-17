import { Controller, HttpStatus, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUserService } from './current-user.service';
import { GetOperation } from '../../decorators/operations/get.decorator';
import { catchAsync } from '../../helpers/utils/catch-async';
import {
    GetCurrentUserQueryDto,
    GetCurrentUsersAlbumsQueryDto,
    GetCurrentUsersTracksQueryDto,
} from './dto/current-user-query.dto';
import { Request } from 'express';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import { GetOneQueryDto } from '../../helpers/common-dtos/common-query.dto';
import { SendResponse } from '../../helpers/utils/send-response';
import { Auth } from '../../decorators/auth.decorator';

@Controller('current-user')
@ApiTags('current-user')
export class CurrentUserController {
    constructor(private $currentUserService: CurrentUserService) {

    }

    /**
     *  --> GET CURRENT USER
     *  @description Returns the current user if exists. if not then returns null
     *  @statusCodes 200, 400 */
    @ApiOperation({ summary: 'GET CURRENT USER' })
    @GetOperation({ path: '/', params: false })
    async getCurrentUser(@Query() query: GetCurrentUserQueryDto, @Req() req: Request) {

        const noUserFound = { status: 'success', user: null };

        let token: string;

        const isAuthHeaderAndIsStatsWithBearer = req.headers.authorization && req.headers.authorization.startsWith('Bearer ');
        const cookiesHaveJwt = req.cookies && req.cookies.jwt;

        if (isAuthHeaderAndIsStatsWithBearer) token = req.headers.authorization.split(' ')[1];
        else if (cookiesHaveJwt) token = req.cookies.jwt;

        if (!token) return noUserFound;

        //@ts-ignore
        const decoded = await catchAsync(promisify(jwt.verify)(token, process.env.JWT_SECRET) as Promise<{ id: string; iat: string }>);

        if (!decoded.id) return noUserFound;

        const user = await this.$currentUserService.getCurrentUser(decoded.id, query);

        if (!user) return noUserFound;

        if (user.passwordChangedAt) {
            const changedTimestamp = parseInt((user.passwordChangedAt.getTime() / 1000).toString(), 10);

            if (+decoded.iat < changedTimestamp) return noUserFound;
        }

        return { status: 'success', data: user };
    }

    /**
     *  --> GET CURRENT USER'S PROFILE
     *  @description Returns the current user's profile
     *  @permissions authenticated users
     *  @statusCodes 200, 403, 400 */
    @ApiOperation({ summary: 'GET CURRENT USER\'S PROFILE' })
    @Auth() @GetOperation({ path: '/user-profile', params: false })
    async getProfile(@Query() query: GetOneQueryDto) {
        return SendResponse(await catchAsync(this.$currentUserService.getProfile(query)));
    }

    /**
     *  --> GET CURRENT USER'S ALBUMS
     *  @description Returns the current user's albums
     *  @permissions authenticated users
     *  @statusCodes 200, 403, 400, 404 */
    @ApiOperation({ summary: 'GET CURRENT USER\'S ALBUMS' })
    @Auth() @GetOperation({ path: '/albums', params: false })
    async getAlbums(@Query() query: GetCurrentUsersAlbumsQueryDto) {
        return SendResponse(await catchAsync(this.$currentUserService.getAlbums(query)));
    }

    /**
     *  --> GET CURRENT USER'S TRACKS
     *  @description Returns the current user's tracks
     *  @permissions authenticated users
     *  @statusCodes 200, 403, 400, 404 */
    @ApiOperation({ summary: 'GET CURRENT USER\'S TRACKS' })
    @Auth() @GetOperation({ path: '/tracks', params: false })
    async getTracks(@Query() query: GetCurrentUsersTracksQueryDto) {
        return SendResponse(await catchAsync(this.$currentUserService.getTracks(query)));
    }
}
