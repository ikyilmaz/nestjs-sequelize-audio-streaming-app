import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { PaginateQueryDto } from '../../helpers/common-dtos/paginate-query.dto';

@Controller('albums')
export class AlbumsController {
    @ApiOkResponse({ description: 'Albums found.' })
    @ApiNotFoundResponse({ description: 'Not found any album.' })
    @Get('/')
    getMany(@Query() query: PaginateQueryDto) {

    }

    @ApiCreatedResponse({ description: 'Album created.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Post()
    create() {

    }
}
