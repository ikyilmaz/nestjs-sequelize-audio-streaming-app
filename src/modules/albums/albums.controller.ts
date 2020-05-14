import {
    BadRequestException,
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
import { isArray, isUUID } from 'class-validator';
import { AuthRequiredGuard } from '../../guards/auth-required.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import sharp = require('sharp');
import moment = require('moment');

@ApiTags('albums')
@Controller('albums')
export class AlbumsController {
    constructor(public $albumsService: AlbumsService) {

    }

    /**
     *  @description Returns albums
     *  @statusCodes 200, 404, 400*/
    @ApiOperation({ summary: 'GET MANY ALBUM' })
    @ApiOkResponse({ description: 'Albums found.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Get('/')
    async getMany(@Query() query: PaginateQueryDto) {
        return SendResponse(await this.$albumsService.getMany(query));
    }

    /**
     * @description Creates album and returns it
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
    async create(
        @Body() createAlbumDto: CreateAlbumDto,
        @UploadedFile() file,
    ) {


        return SendResponse(await this.$albumsService.create(createAlbumDto, file));
    }

    /**
     *  @description Returns the album with the specified id
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET ALBUM' })
    @ApiOkResponse({ description: 'Album found.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Get('/:id')
    async get(@Param() params: ParamIdDto) {

    }

    /**
     *  @description Updates album with the specified id
     *  @permissions authenticated users, owners
     *  @statusCodes 201, 400 */
    @ApiOperation({ summary: 'UPDATE ALBUM' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'User updated.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiForbiddenResponse({ description: 'If the request\'s owner is not the owner of the album.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Patch('/:id')
    async update(@Param() params: ParamIdDto) {

    }

    /**
     *  @description Deletes user with the specified id
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

    }
}
