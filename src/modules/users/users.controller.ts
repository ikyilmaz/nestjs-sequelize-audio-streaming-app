import { Body, Controller, Delete, Get, Param, Patch, Post, Response } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
    ApiBadRequestResponse, ApiBearerAuth,
    ApiCreatedResponse, ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse, ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';
import { UsersService } from './users.service';
import { catchAsync } from '../../helpers/utils/catch-async';
import { SendResponse } from '../../helpers/utils/send-response';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(public $usersService: UsersService) {
    }

    @ApiOkResponse({ description: 'Everything went fine. User found.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @Get('/')
    async getMany() {
        return SendResponse(await catchAsync(this.$usersService.getMany()));
    }

    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'Everything went fine. User created.' })
    @ApiForbiddenResponse({ description: '-' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Post('/')
    async create(@Body() createUserDto: CreateUserDto) {
        return SendResponse(await catchAsync(this.$usersService.create(createUserDto)));
    }

    @ApiOkResponse({ description: 'Everything went fine. Users found.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @Get('/:id')
    async get(@Param() params: ParamIdDto) {
        return SendResponse(await catchAsync(this.$usersService.get(params.id)));
    }

    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Everything went fine. User updated.' })
    @ApiForbiddenResponse({ description: '-' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Patch('/:id')
    async update(@Param() params: ParamIdDto, @Body() updateUserDto: UpdateUserDto) {
        await catchAsync(this.$usersService.update(params.id, updateUserDto));
    }

    @ApiBearerAuth()
    @ApiNoContentResponse({ description: 'Everything went fine. User deleted.' })
    @ApiForbiddenResponse({ description: '-' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @Delete('/:id')
    async delete(@Param() params: ParamIdDto) {
        await catchAsync(this.$usersService.delete(params.id));
    }
}
