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
    Query,
    SetMetadata,
    UploadedFile,
    UseGuards,
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
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';
import { AlbumsService } from './albums.service';
import { SendResponse } from '../../helpers/utils/send-response';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AuthRequiredGuard } from '../../guards/auth-required.guard';
import { filterObject } from '../../helpers/utils/filter-object';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { catchAsync } from '../../helpers/utils/catch-async';
import { IsOwnerGuard } from '../../guards/is-owner.guard';
import Album from '../../models/album/album.model';
import { GetManyAlbumQueryDto, GetOneAlbumQueryDto } from './dto/album-query.dto';

@ApiTags('albums')
@Controller('albums')
export class AlbumsController {
    constructor(public $albumsService: AlbumsService) {

    }

    /**
     *  --> GET MANY ALBUM
     *  @description Returns albums
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET MANY ALBUM' })
    @ApiOkResponse({ description: 'Albums found.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Get('/')
    async getMany(@Query() query: GetManyAlbumQueryDto) {
        return SendResponse(await catchAsync(this.$albumsService.getMany(query)));
    }

    /**
     * --> CREATE ALBUM
     * @description Creates an album and returns it
     * @permissions authenticated users
     * @statusCodes 201, 400 */
    @ApiOperation({ summary: 'CREATE ALBUM' })
    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'Album created.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @UseGuards(AuthRequiredGuard)
    @Post('/')
    async create(@Body() createAlbumDto: CreateAlbumDto, @UploadedFile() file) {
        return SendResponse(await catchAsync(this.$albumsService.create(filterObject(createAlbumDto, ['ownerId', 'photo']))));
    }

    /**
     *  --> GET ONE ALBUM BY ID
     *  @description Returns an album with the specified id
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET ALBUM' })
    @ApiOkResponse({ description: 'Album found.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @ApiParam({ name: 'id', type: 'UUID' })
    @Get('/:id')
    async get(@Param() params: ParamIdDto, @Query() query: GetOneAlbumQueryDto) {
        return SendResponse(await catchAsync(this.$albumsService.get(query, params.id)));
    }

    /**
     *  --> UPDATE ALBUM
     *  @description Updates an album with the specified id
     *  @permissions authenticated users, owners
     *  @statusCodes 200, 403, 400, 404 */
    @ApiOperation({ summary: 'UPDATE ALBUM' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Album updated.' })
    @ApiForbiddenResponse({ description: 'If the request\'s owner is not the owner of the album.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @ApiParam({ name: 'id', type: 'UUID' })
    @SetMetadata('model', Album)
    @UseGuards(AuthRequiredGuard, IsOwnerGuard)
    @Patch('/:id')
    async update(@Param() params: ParamIdDto, @Body() updateAlbumDto: UpdateAlbumDto, @UploadedFile() file) {
        await catchAsync(this.$albumsService.update(params.id, filterObject(updateAlbumDto, ['ownerId', 'photo'])));
    }

    /**
     *  --> DELETE ALBUM
     *  @description Deletes an album with the specified id
     *  @permissions authenticated users, owners
     *  @statusCodes 204, 404, 400 */
    @ApiOperation({ summary: 'DELETE ALBUM' })
    @ApiBearerAuth()
    @ApiNoContentResponse({ description: 'Album deleted.' })
    @ApiForbiddenResponse({ description: 'If the request\'s owner is not the owner of the album.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @ApiParam({ name: 'id', type: 'UUID' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @SetMetadata('model', Album)
    @UseGuards(AuthRequiredGuard, IsOwnerGuard)
    @Delete('/:id')
    async delete(@Param() params: ParamIdDto) {
        await catchAsync(this.$albumsService.delete(params.id));
    }
}
