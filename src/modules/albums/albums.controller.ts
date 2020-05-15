import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query, UploadedFile,
    UseGuards, UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PaginateQueryDto } from '../../helpers/common-dtos/paginate-query.dto';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';
import { AlbumsService } from './albums.service';
import { SendResponse } from '../../helpers/utils/send-response';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AuthRequiredGuard } from '../../guards/auth-required.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { filterObject } from '../../helpers/utils/filter-object';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { catchAsync } from '../../helpers/utils/catch-async';

@ApiTags('albums')
@Controller('albums')
export class AlbumsController {
    constructor(public $albumsService: AlbumsService) {

    }

    /**
     *  @description Returns albums
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET MANY ALBUM' })
    @ApiOkResponse({ description: 'Albums found.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Get('/')
    async getMany(@Query() query: PaginateQueryDto) {
        return SendResponse(await catchAsync(this.$albumsService.getMany(query)));
    }

    /**
     * @description Creates an album and returns it
     * @permissions authenticated users
     * @statusCodes 201, 400 */
    @ApiOperation({ summary: 'CREATE ALBUM' })
    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'Album created.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @UseGuards(AuthRequiredGuard)
    @UseInterceptors(FileInterceptor('photo', {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image')) return cb(null, true);
            cb(new Error('Not an image! Please upload only images.'), false);
        },
    }))
    @Post('/')
    async create(@Body() createAlbumDto: CreateAlbumDto, @UploadedFile() file) {
        return SendResponse(await catchAsync(this.$albumsService.create(
            filterObject(createAlbumDto, ['ownerId', 'photo']), // Removes the unwanted fields
            file,
        )));
    }

    /**
     *  @description Returns an album with the specified id
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET ALBUM' })
    @ApiOkResponse({ description: 'Album found.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Get('/:id')
    async get(@Param() params: ParamIdDto) {
        return SendResponse(await catchAsync(this.$albumsService.get(params.id)));
    }

    /**
     *  @description Updates an album with the specified id
     *  @permissions authenticated users, owners
     *  @statusCodes 201, 400 */
    @ApiOperation({ summary: 'UPDATE ALBUM' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'User updated.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiForbiddenResponse({ description: 'If the request\'s owner is not the owner of the album.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @UseInterceptors(FileInterceptor('photo', {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image')) return cb(null, true);
            cb(new Error('Not an image! Please upload only images.'), false);
        },
    }))
    @Patch('/:id')
    async update(@Param() params: ParamIdDto, @Body() updateAlbumDto: UpdateAlbumDto, @UploadedFile() file) {
        await catchAsync(this.$albumsService.update(
            params.id,
            filterObject(updateAlbumDto, ['ownerId', 'photo']), // Removes the unwanted fields
            file,
        ));
    }

    /**
     *  @description Deletes an album with the specified id
     *  @permissions authenticated users, owners
     *  @statusCodes 204, 404, 400 */
    @ApiOperation({ summary: 'DELETE ALBUM' })
    @ApiBearerAuth()
    @ApiNoContentResponse({ description: 'User deleted.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiForbiddenResponse({ description: 'If the request\'s owner is not the owner of the album.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    async delete(@Param() params: ParamIdDto) {
        await catchAsync(this.$albumsService.delete(params.id));
    }
}
