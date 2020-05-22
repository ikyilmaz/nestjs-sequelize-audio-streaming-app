import {
    BadRequestException,
    Body,
    Controller,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Query,
    Req, Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { SendResponse } from '../../helpers/utils/send-response';
import { catchAsync } from '../../helpers/utils/catch-async';
import { CreateTrackDto } from './dto/create-track.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';
import { GetManyTrackQueryDto, GetOneTrackQueryDto } from './dto/track-query.dto';
import Track from '../../models/track/track.model';
import { UpdateTrackDto } from './dto/update-track.dto';
import { GetOperation } from '../../decorators/operations/get.decorator';
import { GetManyOperation } from '../../decorators/operations/get-many.decorator';
import { Auth } from '../../decorators/auth.decorator';
import { CreateOperation } from '../../decorators/operations/create.decorator';
import { UpdateOperation } from '../../decorators/operations/update.decorator';
import { DeleteOperation } from '../../decorators/operations/delete.decorator';
import { Request, Response } from 'express';
import { ReadStream, Stats } from 'fs';
import * as fs from 'fs';

@Controller('tracks')
@ApiTags('tracks')
export class TracksController {
    constructor(private readonly $tracksService: TracksService) {

    }

    /**
     * --> GET MOST LISTENED TRACKS
     * @description get most listened tracks
     * @statusCodes 200, 400*/
    @ApiOperation({ summary: 'GET MOST LISTENED TRACKS' }) @GetManyOperation('/most-listened')
    async getMostListenedTracks() {
        return SendResponse(await this.$tracksService.getMostListened());
    }

    /**
     * --> GET MOST LIKED TRACKS
     * @description get most likes tracks
     * @statusCodes 200, 400*/
    @ApiOperation({ summary: 'GET MOST LIKED TRACKS' }) @GetManyOperation('/most-liked')
    async getMostLikedTracks() {
        return SendResponse(await this.$tracksService.getMostLiked());
    }

    /**
     *  --> STREAM TRACK
     *  @description Returns track
     *  @statusCodes 200, 404, 400 */

    @ApiOperation({ summary: 'STREAM TRACK' }) @GetOperation({
        path: '/:key/stream',
        params: [{ name: 'key', type: String }],
    })
    async stream(@Req() req: Request, @Res() res: Response, @Param('key') key: string) {

        const music = `${__dirname}/../public/assets/audio/tracks/${key}.mp3`;

        let stat: Stats;

        try {
            stat = fs.statSync(`${__dirname}/../public/assets/audio/tracks/${key}.mp3`);
        } catch (e) {
            throw new NotFoundException();
        }

        const range = req.headers.range;

        let readStream: ReadStream;

        if (range !== undefined) {
            const parts = range.replace(/bytes=/, '').split('-');

            const partialStart = parts[0];
            const partialEnd = parts[1];

            if ((isNaN(Number(partialStart)) && partialStart.length > 1) || (isNaN(Number(partialEnd)) && partialEnd.length > 1)) {
                throw new InternalServerErrorException('something went wrong'); //ERR_INCOMPLETE_CHUNKED_ENCODING
            }

            const start = parseInt(partialStart, 10);
            const end = partialEnd ? parseInt(partialEnd, 10) : stat.size - 1;
            const contentLength = (end - start) + 1;

            res.status(206).header({
                'Content-Type': 'audio/mpeg',
                'Content-Length': contentLength,
                'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size,
            });

            readStream = fs.createReadStream(music, { start: start, end: end });
        } else {
            res.header({
                'Content-Type': 'audio/mpeg',
                'Content-Length': stat.size,
            });
            readStream = fs.createReadStream(music);
        }

        await this.$tracksService.incrementListenCount(key);

        readStream.pipe(res);
    }

    /**
     *  --> GET MANY TRACK
     *  @description Returns tracks
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET MANY TRACK' }) @GetManyOperation()
    async getMany(@Query() query: GetManyTrackQueryDto) {
        return SendResponse(await catchAsync(this.$tracksService.getMany(query)));
    }

    /**
     *  --> CREATE TRACK
     *  @description Creates a track and returns it
     *  @permissions Authenticated users
     *  @statusCodes 201, 404, 400 */
    @ApiOperation({ summary: 'CREATE TRACK' }) @Auth() @CreateOperation()
    @UseInterceptors(FileInterceptor('track', {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {

            if (!file.mimetype.startsWith('audio') || file.originalname.split('.').reverse()[0] != 'mp3')
                return cb(new Error('Please upload only mp3 files.'), false);

            cb(null, true);
        },
    }))
    async create(@Body() createTrackDto: CreateTrackDto, @UploadedFile() file) {
        if (!file) throw new BadRequestException('please specify field track');

        return SendResponse(await catchAsync(this.$tracksService.create(createTrackDto, file)));
    }

    /**
     *  --> GET ONE TRACK
     *  @description Returns one track
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET ONE TRACK' }) @GetOperation()
    async get(@Param() params: ParamIdDto, @Query() query: GetOneTrackQueryDto) {
        return SendResponse(await catchAsync(this.$tracksService.get(params.id, query)));
    }

    /**
     *  --> UPDATE TRACK
     *  @description Updates a track with the specified id
     *  @permissions authenticated users, owners
     *  @statusCodes 200, 403, 400, 404 */
    @ApiOperation({ summary: 'UPDATE TRACK' }) @Auth({ isOwner: Track }) @UpdateOperation()
    async update(@Param() params: ParamIdDto, @Body() updateTrackDto: UpdateTrackDto, @UploadedFile() file) {
        await catchAsync(this.$tracksService.update(params.id, updateTrackDto));
    }

    /**
     *  --> DELETE TRACK
     *  @description Deletes a track with the specified id
     *  @permissions authenticated users, owners
     *  @statusCodes 204, 404, 400 */
    @ApiOperation({ summary: 'DELETE TRACK' }) @Auth({ isOwner: Track }) @DeleteOperation()
    async delete(@Param() params: ParamIdDto) {
        await catchAsync(this.$tracksService.delete(params.id));
    }
}
