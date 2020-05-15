import {
    BadRequestException,
    Body,
    Controller,
    Get, InternalServerErrorException, NotFoundException, Param,
    Post,
    Query, Req, Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { PaginateQueryDto } from '../../helpers/common-dtos/paginate-query.dto';
import { SendResponse } from '../../helpers/utils/send-response';
import { catchAsync } from '../../helpers/utils/catch-async';
import { AuthRequiredGuard } from '../../guards/auth-required.guard';
import { CreateTrackDto } from './dto/create-track.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';

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
    async getMany(@Query() query: PaginateQueryDto) {
        return SendResponse(await catchAsync(this.$tracksService.getMany(query)));
    }

    /**
     *  --> CREATE TRACK
     *  @description Returns tracks
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
     *  @description Returns track
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET ONE TRACK' })
    @ApiOkResponse({ description: 'Track found.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @UseGuards(AuthRequiredGuard)
    @Get('/:id')
    async get(@Param() params: ParamIdDto) {
        return SendResponse(await catchAsync(this.$tracksService.get(params.id)));
    }
}
