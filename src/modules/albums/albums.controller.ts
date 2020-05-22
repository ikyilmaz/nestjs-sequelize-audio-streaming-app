import { BadRequestException, Body, Controller, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';
import { AlbumsService } from './albums.service';
import { SendResponse } from '../../helpers/utils/send-response';
import { CreateAlbumDto } from './dto/create-album.dto';
import { filterObject } from '../../helpers/utils/filter-object';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { catchAsync } from '../../helpers/utils/catch-async';
import Album from '../../models/album/album.model';
import { GetManyAlbumQueryDto, GetOneAlbumQueryDto } from './dto/album-query.dto';
import { GetManyOperation } from '../../decorators/operations/get-many.decorator';
import { Auth } from '../../decorators/auth.decorator';
import { CreateOperation } from '../../decorators/operations/create.decorator';
import { GetOperation } from '../../decorators/operations/get.decorator';
import { UpdateOperation } from '../../decorators/operations/update.decorator';
import { DeleteOperation } from '../../decorators/operations/delete.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@ApiTags('albums')
@Controller('albums')
export class AlbumsController {
    constructor(public $albumsService: AlbumsService) {

    }

    /**
     * --> GET MOST LIKED ALBUMS
     * @description get most liked albums
     * @statusCodes 200, 400*/
    @ApiOperation({ summary: 'GET MOST LIKED ALBUMS' }) @GetManyOperation('/most-liked')
    async getMostLikedTracks() {
        return SendResponse(await this.$albumsService.getMostLiked());
    }

    /**
     *  --> GET MANY ALBUM
     *  @description Returns albums
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET MANY ALBUM' }) @GetManyOperation()
    async getMany(@Query() query: GetManyAlbumQueryDto) {
        return SendResponse(await catchAsync(this.$albumsService.getMany(query)));
    }

    /**
     * --> CREATE ALBUM
     * @description Creates an album and returns it
     * @permissions authenticated users
     * @statusCodes 201, 400 */
    @ApiOperation({ summary: 'CREATE ALBUM' }) @Auth() @CreateOperation()
    async create(@Body() createAlbumDto: CreateAlbumDto, @UploadedFile() file) {
        return SendResponse(await catchAsync(this.$albumsService.create(filterObject(createAlbumDto, ['ownerId', 'photo']))));
    }

    /**
     *  --> GET ONE ALBUM BY ID
     *  @description Returns an album with the specified id
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET ALBUM' }) @GetOperation()
    async get(@Param() params: ParamIdDto, @Query() query: GetOneAlbumQueryDto) {
        return SendResponse(await catchAsync(this.$albumsService.get(query, params.id)));
    }

    /**
     *  --> UPDATE ALBUM
     *  @description Updates an album with the specified id
     *  @permissions authenticated users, owners
     *  @statusCodes 200, 403, 400, 404 */
    @ApiOperation({ summary: 'UPDATE ALBUM' }) @Auth({ isOwner: Album }) @UpdateOperation()
    async update(@Param() params: ParamIdDto, @Body() updateAlbumDto: UpdateAlbumDto, @UploadedFile() file) {
        await catchAsync(this.$albumsService.update(params.id, filterObject(updateAlbumDto, ['ownerId', 'photo'])));
    }

    /**
     *  --> DELETE ALBUM
     *  @description Deletes an album with the specified id
     *  @permissions authenticated users, owners
     *  @statusCodes 204, 404, 400 */
    @ApiOperation({ summary: 'DELETE ALBUM' }) @Auth({ isOwner: Album }) @DeleteOperation()
    async delete(@Param() params: ParamIdDto) {
        await catchAsync(this.$albumsService.delete(params.id));
    }


    /**
     * --> UPDATE ALBUM PHOTO
     * @description Updates album's photo
     * @permissions authenticated users
     * @statusCodes 200, 400 */
    @ApiOperation({ summary: 'UPDATE ALBUM\'S PHOTO' }) @Auth({ isOwner: Album }) @UpdateOperation('/:id/photo')
    @UseInterceptors(FileInterceptor('photo', {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image')) return cb(null, true);
            cb(new Error('Not an image! Please upload only images.'), false);
        },
    }))
    async updateAlbumPhoto(@Param() params: ParamIdDto, @UploadedFile() file) {
        if (!file) throw new BadRequestException('please specify the file');
        return SendResponse(await catchAsync(this.$albumsService.updateAlbumPhoto(params.id, file)));
    }
}
