import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Patch,
    Post,
    Query, Req, Res, SetMetadata,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBearerAuth,
    ApiForbiddenResponse, ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation, ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { CommonQueryDto } from '../../helpers/common-dtos/common-query.dto';
import { SendResponse } from '../../helpers/utils/send-response';
import { catchAsync } from '../../helpers/utils/catch-async';
import { AuthRequiredGuard } from '../../guards/auth-required.guard';
import { CreateTrackDto } from './dto/create-track.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';
import { GetManyTrackQueryDto } from './dto/get-many-track-query.dto';
import Album from '../../models/album/album.model';
import { IsOwnerGuard } from '../../guards/is-owner.guard';
import { UpdateAlbumDto } from '../albums/dto/update-album.dto';
import { filterObject } from '../../helpers/utils/filter-object';
import Track from '../../models/track/track.model';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('tracks')
@ApiTags('tracks')
export class TracksController {
    constructor(private $tracksService: TracksService) {

    }

    /**
     *  --> GET MANY TRACK
     *  @description Returns tracks
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET MANY TRACK' })
    @ApiOkResponse({ description: 'Tracks found.' })
    @ApiNotFoundResponse({ description: 'Not found any track.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Get('/')
    async getMany(@Query() query: GetManyTrackQueryDto) {
        return SendResponse(await catchAsync(this.$tracksService.getMany(query)));
    }

    /**
     *  --> CREATE TRACK
     *  @description Creates a track and returns it
     *  @permissions Authenticated users
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'CREATE TRACK' })
    @ApiOkResponse({ description: 'Track created.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @UseInterceptors(FileInterceptor('track', {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {

            if (!file.mimetype.startsWith('audio') || file.originalname.split('.').reverse()[0] != 'mp3')
                return cb(new Error('Please upload only mp3 files.'), false);

            cb(null, true);
        },
    }))
    @UseGuards(AuthRequiredGuard)
    @Post('/')
    async create(@Body() createTrackDto: CreateTrackDto, @UploadedFile() file) {
        if (!file) throw new BadRequestException('please specify field track');

        return SendResponse(await catchAsync(this.$tracksService.create(createTrackDto, file)));
    }

    /**
     *  --> GET ONE TRACK
     *  @description Returns one track
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET ONE TRACK' })
    @ApiOkResponse({ description: 'Track found.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @UseGuards(AuthRequiredGuard)
    @Get('/:id')
    async get(@Param() params: ParamIdDto) {
        return SendResponse(await catchAsync(this.$tracksService.get(params.id)));
    }

    /**
     *  --> UPDATE TRACK
     *  @description Updates a track with the specified id
     *  @permissions authenticated users, owners
     *  @statusCodes 200, 403, 400, 404 */
    @ApiOperation({ summary: 'UPDATE TRACK' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Track updated.' })
    @ApiForbiddenResponse({ description: 'If the request\'s owner is not the owner of the track.' })
    @ApiNotFoundResponse({ description: 'Not found any track.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @ApiParam({ name: 'id', type: 'UUID' })
    @SetMetadata('model', Track)
    @UseGuards(AuthRequiredGuard, IsOwnerGuard)
    @Patch('/:id')
    async update(@Param() params: ParamIdDto, @Body() updateTrackDto: UpdateTrackDto, @UploadedFile() file) {
        await catchAsync(this.$tracksService.update(params.id, filterObject(updateTrackDto, ['albumId'])));
    }

    /**
     *  --> DELETE TRACK
     *  @description Deletes a track with the specified id
     *  @permissions authenticated users, owners
     *  @statusCodes 204, 404, 400 */
    @ApiOperation({ summary: 'DELETE TRACK' })
    @ApiBearerAuth()
    @ApiNoContentResponse({ description: 'Track deleted.' })
    @ApiForbiddenResponse({ description: 'If the request\'s owner is not the owner of the track.' })
    @ApiNotFoundResponse({ description: 'Not found any track.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @ApiParam({ name: 'id', type: 'UUID' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @SetMetadata('model', Track)
    @UseGuards(AuthRequiredGuard, IsOwnerGuard)
    @Delete('/:id')
    async delete(@Param() params: ParamIdDto) {
        await catchAsync(this.$tracksService.delete(params.id));
    }
}
