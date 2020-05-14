import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse, ApiOperation, ApiTags,
} from '@nestjs/swagger';
import { PaginateQueryDto } from '../../helpers/common-dtos/paginate-query.dto';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';
import { AlbumsService } from './albums.service';

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

    }

    /**
     * @description Creates album and returns it
     * @permissions authenticated users
     * @statusCodes 201, 400 */
    @ApiOperation({ summary: 'CREATE ALBUM' })
    @ApiCreatedResponse({ description: 'Album created.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Post()
    create() {

    }

    /**
     *  @description Returns the album with the specified id
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET ALBUM' })
    @ApiOkResponse({ description: 'User found.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
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
    @ApiForbiddenResponse({ description: 'Forbidden.' })
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
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    async delete(@Param() params: ParamIdDto) {

    }
}
