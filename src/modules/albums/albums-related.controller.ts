import {
    BadRequestException,
    Controller,
    Delete,
    Param,
    Post, SetMetadata,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse, ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { AuthRequiredGuard } from '../../guards/auth-required.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';
import { SendResponse } from '../../helpers/utils/send-response';
import { catchAsync } from '../../helpers/utils/catch-async';
import { AlbumsService } from './albums.service';
import { IsOwnerGuard } from '../../guards/is-owner.guard';
import Album from '../../models/album/album.model';

@ApiTags('albums')
@Controller('albums')
export class AlbumsRelatedController {

    constructor(public $albumsService: AlbumsService) {

    }

    /**
     * --> ADD MANY ARTIST TO ALBUM
     * @description Creates an album and returns it
     * @permissions authenticated users, owners
     * @statusCodes 201, 400 */
    @Post('/:id/add-artists')
    addManyArtistToAlbum() {

    }

    /**
     * --> DELETE ONE ARTIST FROM ALBUM
     * @description Creates an album and returns it
     * @permissions authenticated users, owners
     * @statusCodes 201, 400 */
    @Delete('/:id/remove-artist')
    deleteArtistFromAlbum() {

    }

    /**
     * --> UPDATE ALBUM PHOTO
     * @description Updates album's photo
     * @permissions authenticated users
     * @statusCodes 200, 400 */
    @ApiOperation({ summary: 'UPDATE ALBUM\'S PHOTO' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Album\'s photo updated.' })
    @ApiForbiddenResponse({ description: 'If the request\'s owner is not the owner of the album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @SetMetadata("model", Album)
    @UseGuards(AuthRequiredGuard, IsOwnerGuard)
    @UseInterceptors(FileInterceptor('photo', {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image')) return cb(null, true);
            cb(new Error('Not an image! Please upload only images.'), false);
        },
    }))
    @Post('/:id/update-photo')
    async updateAlbumPhoto(@Param() params: ParamIdDto, @UploadedFile() file) {
        if (!file) throw new BadRequestException('please specify the file');
        return SendResponse(await catchAsync(this.$albumsService.updateAlbumPhoto(params.id, file)));
    }


}