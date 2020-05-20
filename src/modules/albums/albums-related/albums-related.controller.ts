import { BadRequestException, Body, Controller, Delete, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { SendResponse } from '../../../helpers/utils/send-response';
import { catchAsync } from '../../../helpers/utils/catch-async';
import Album from '../../../models/album/album.model';
import { AlbumsRelatedService } from './albums-related.service';
import { AddArtistsDto } from './dto/add-artists.dto';
import { RemoveArtistsDto } from './dto/remove-artists.dto';
import { Auth } from '../../../decorators/auth.decorator';
import { CreateOperation } from '../../../decorators/operations/create.decorator';
import { UpdateOperation } from '../../../decorators/operations/update.decorator';
import { DeleteOperation } from '../../../decorators/operations/delete.decorator';

@ApiTags('albums')
@Controller('albums')
export class AlbumsRelatedController {

    constructor(public $albumsRelatedService: AlbumsRelatedService) {

    }

    /**
     * --> ADD LIKE
     * @description adds a like to the specified album
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'ADD LIKE' }) @Auth() @CreateOperation('/:id/add-like')
    async addLike(@Param() params: ParamIdDto) {
        return SendResponse(await catchAsync(this.$albumsRelatedService.addLike(params.id)));
    }

    /**
     * --> REMOVE LIKE
     * @description removes a like to the specified album
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'REMOVE LIKE' }) @Auth() @DeleteOperation('/:id/remove-like')
    async removeLike(@Param() params: ParamIdDto) {
        await catchAsync(this.$albumsRelatedService.removeLike(params.id));
    }

    /**
     * --> ADD MANY ARTIST TO ALBUM
     * @description Adds artists to specified album
     * @permissions authenticated users, owners
     * @statusCodes 201, 400, 404 */
    @ApiOperation({ summary: 'ADD MANY ARTIST TO ALBUM' }) @Auth({ isOwner: Album }) @CreateOperation('/:id/add-artists')
    async addManyArtistToAlbum(@Param() params: ParamIdDto, @Body() addArtistsDto: AddArtistsDto) {
        await catchAsync(this.$albumsRelatedService.addArtists(params.id, addArtistsDto));
    }

    /**
     * --> REMOVE MANY ARTIST FROM ALBUM
     * @description Removes artists from specified album
     * @permissions authenticated users, owners
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'REMOVE MANY ARTIST FROM ALBUM' }) @Auth({ isOwner: Album }) @Delete('/:id/remove-artists')
    async removeManyArtistFromAlbum(@Param() params: ParamIdDto, @Body() removeArtistsDto: RemoveArtistsDto) {
        await catchAsync(this.$albumsRelatedService.removeArtists(params.id, removeArtistsDto));
    }

    /**
     * --> UPDATE ALBUM PHOTO
     * @description Updates album's photo
     * @permissions authenticated users
     * @statusCodes 200, 400 */
    @ApiOperation({ summary: 'UPDATE ALBUM\'S PHOTO' }) @Auth({ isOwner: Album }) @UpdateOperation('/:id/update-photo')
    @UseInterceptors(FileInterceptor('photo', {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image')) return cb(null, true);
            cb(new Error('Not an image! Please upload only images.'), false);
        },
    }))
    async updateAlbumPhoto(@Param() params: ParamIdDto, @UploadedFile() file) {
        if (!file) throw new BadRequestException('please specify the file');
        return SendResponse(await catchAsync(this.$albumsRelatedService.updateAlbumPhoto(params.id, file)));
    }


}
