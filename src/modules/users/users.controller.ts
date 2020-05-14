import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
    ApiBadRequestResponse, ApiBearerAuth,
    ApiCreatedResponse, ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
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
    create(@Body() createUserDto: CreateUserDto) {

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
    update(@Param() params: ParamIdDto, @Body() updateUserDto: UpdateUserDto) {

    }

    @ApiBearerAuth()
    @ApiNoContentResponse({ description: 'Everything went fine. User deleted.' })
    @ApiForbiddenResponse({ description: '-' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @Delete('/:id')
    delete(@Param() params: ParamIdDto) {

    }
}
