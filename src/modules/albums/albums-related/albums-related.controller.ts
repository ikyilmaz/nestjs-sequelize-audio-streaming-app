import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    Post, SetMetadata,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { AuthRequiredGuard } from '../../../guards/auth-required.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { SendResponse } from '../../../helpers/utils/send-response';
import { catchAsync } from '../../../helpers/utils/catch-async';
import { IsOwnerGuard } from '../../../guards/is-owner.guard';
import Album from '../../../models/album/album.model';
import { AlbumsRelatedService } from './albums-related.service';
import { AddArtistsDto } from './dto/add-artists.dto';
import { RemoveArtistsDto } from './dto/remove-artists.dto';

@ApiTags('albums')
@Controller('albums')
export class AlbumsRelatedController {

    constructor(public $albumsRelatedService: AlbumsRelatedService) {

    }

    /**
     * --> ADD MANY ARTIST TO ALBUM
     * @description Adds artists to specified album
     * @permissions authenticated users, owners
     * @statusCodes 201, 400, 404 */
    @ApiOperation({ summary: 'ADD MANY ARTIST TO ALBUM' })
    @ApiBearerAuth()
    @ApiNoContentResponse()
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    @ApiForbiddenResponse()
    @ApiParam({ name: 'id', type: 'UUID' })
    @SetMetadata('model', Album)
    @UseGuards(AuthRequiredGuard, IsOwnerGuard)
    @Post('/:id/add-artists')
    async addManyArtistToAlbum(@Param() params: ParamIdDto, @Body() addArtistsDto: AddArtistsDto) {
        await catchAsync(this.$albumsRelatedService.addArtists(params.id, addArtistsDto));
    }

    /**
     * --> REMOVE MANY ARTIST FROM ALBUM
     * @description Removes artists from specified album
     * @permissions authenticated users, owners
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'REMOVE MANY ARTIST FROM ALBUM' })
    @ApiBearerAuth()
    @ApiNoContentResponse()
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    @ApiForbiddenResponse()
    @ApiParam({ name: 'id', type: 'UUID' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @SetMetadata('model', Album)
    @UseGuards(AuthRequiredGuard, IsOwnerGuard)
    @Delete('/:id/remove-artists')
    async removeManyArtistFromAlbum(@Param() params: ParamIdDto, @Body() removeArtistsDto: RemoveArtistsDto) {
        await catchAsync(this.$albumsRelatedService.removeArtists(params.id, removeArtistsDto));
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
    @SetMetadata('model', Album)
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
        return SendResponse(await catchAsync(this.$albumsRelatedService.updateAlbumPhoto(params.id, file)));
    }


}
