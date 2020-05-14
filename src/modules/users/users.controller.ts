import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Response } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
    ApiBadRequestResponse, ApiBearerAuth,
    ApiCreatedResponse, ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse, ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';
import { UsersService } from './users.service';
import { catchAsync } from '../../helpers/utils/catch-async';
import { SendResponse } from '../../helpers/utils/send-response';
import { PaginateQueryDto } from '../../helpers/common-dtos/paginate-query.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(public $usersService: UsersService) {

    }

    @ApiOkResponse({ description: 'User found.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @Get('/')
    async getMany(@Query() query: PaginateQueryDto) {
        return SendResponse(await catchAsync(this.$usersService.getMany(query)));
    }

    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'User created.' })
    @ApiForbiddenResponse({ description: '-' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Post('/')
    async create(@Body() createUserDto: CreateUserDto) {
        return SendResponse(await catchAsync(this.$usersService.create(createUserDto)));
    }

    @ApiOkResponse({ description: 'Users found.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @Get('/:id')
    async get(@Param() params: ParamIdDto) {
        return SendResponse(await catchAsync(this.$usersService.get(params.id)));
    }

    @ApiBearerAuth()
    @ApiOkResponse({ description: 'User updated.' })
    @ApiForbiddenResponse({ description: '-' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Patch('/:id')
    async update(@Param() params: ParamIdDto, @Body() updateUserDto: UpdateUserDto) {
        await catchAsync(this.$usersService.update(params.id, updateUserDto));
    }

    @ApiBearerAuth()
    @ApiNoContentResponse({ description: 'User deleted.' })
    @ApiForbiddenResponse({ description: '-' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @Delete('/:id')
    async delete(@Param() params: ParamIdDto) {
        await catchAsync(this.$usersService.delete(params.id));
    }
}
