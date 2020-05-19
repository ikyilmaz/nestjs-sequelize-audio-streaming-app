import { Body, Controller, InternalServerErrorException, NotFoundException, Param, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { ReadStream, Stats } from 'fs';
import { TracksRelatedService } from './tracks-related.service';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { AddArtistsDto } from '../../albums/albums-related/dto/add-artists.dto';
import { catchAsync } from '../../../helpers/utils/catch-async';
import { RemoveArtistsDto } from '../../albums/albums-related/dto/remove-artists.dto';
import Track from '../../../models/track/track.model';
import { Auth } from '../../../decorators/auth.decorator';
import { CreateOperation } from '../../../decorators/operations/create.decorator';
import { DeleteOperation } from '../../../decorators/operations/delete.decorator';
import { GetOperation } from '../../../decorators/operations/get.decorator';

@Controller('tracks')
@ApiTags('tracks')
export class TracksRelatedController {

    constructor(private $tracksRelatedService: TracksRelatedService) {

    }

    /**
     * --> ADD MANY ARTIST TO TRACK
     * @description Adds artists to specified track
     * @permissions authenticated users, owners
     * @statusCodes 201, 400, 404 */
    @ApiOperation({ summary: 'ADD MANY ARTIST TO TRACK' }) @Auth({ isOwner: Track }) @CreateOperation('/:id/add-artists')
    async addManyArtistToAlbum(@Param() params: ParamIdDto, @Body() addArtistsDto: AddArtistsDto) {
        await catchAsync(this.$tracksRelatedService.addArtists(params.id, addArtistsDto));
    }

    /**
     * --> REMOVE MANY ARTIST FROM TRACK
     * @description Removes artists from specified track
     * @permissions authenticated users, owners
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'REMOVE MANY ARTIST FROM TRACK' }) @Auth({ isOwner: Track }) @DeleteOperation('/:id/remove-artists')
    async removeManyArtistFromAlbum(@Param() params: ParamIdDto, @Body() removeArtistsDto: RemoveArtistsDto) {
        await catchAsync(this.$tracksRelatedService.removeArtists(params.id, removeArtistsDto));
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

        await this.$tracksRelatedService.incrementListenCount(key);

        readStream.pipe(res);
    }
}
