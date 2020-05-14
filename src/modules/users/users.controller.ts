import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
    @ApiOkResponse({ description: 'Everything went fine. User found.' })
    @ApiNotFoundResponse({ description: 'Couldn\'t found any user.' })
    @Get('/')
    getMany() {

    }

    @ApiCreatedResponse({ description: 'Everything went fine. User created.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Post('/')
    create(@Body() createUserDto: CreateUserDto) {

    }

    @ApiOkResponse({ description: 'Everything went fine. Users found.' })
    @ApiNotFoundResponse({ description: 'Couldn\'t found any user.' })
    @Get('/:id')
    get() {

    }

    @ApiOkResponse({ description: 'Everything went fine. User updated.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Patch('/:id')
    update() {

    }

    @ApiNoContentResponse({ description: 'Everything went fine. User deleted.' })
    @ApiNotFoundResponse({ description: 'Couldn\'t found any user.' })
    @Delete('/:id')
    delete() {

    }
}
