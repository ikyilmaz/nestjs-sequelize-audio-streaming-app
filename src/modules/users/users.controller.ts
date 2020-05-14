import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
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
    constructor(public $usersService: UsersService) {}

    /**
     *  @description Returns users
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET MANY USER' })
    @ApiOkResponse({ description: 'Users found.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Get('/')
    async getMany(@Query() query: PaginateQueryDto) {
        return SendResponse(await catchAsync(this.$usersService.getMany(query)));
    }

    /**
     * @description Creates user and returns it
     * @permissions admins
     * @statusCodes 201, 400 */
    @ApiOperation({ summary: 'CREATE USER' })
    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'User created.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Post('/')
    async create(@Body() createUserDto: CreateUserDto) {
        return SendResponse(await catchAsync(this.$usersService.create(createUserDto)));
    }

    /**
     *  @description Returns the user with the specified id
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET USER' })
    @ApiOkResponse({ description: 'User found.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Get('/:id')
    async get(@Param() params: ParamIdDto) {
        return SendResponse(await catchAsync(this.$usersService.get(params.id)));
    }

    /**
     *  @description Updates user with the specified id
     *  @permissions admins
     *  @statusCodes 201, 400 */
    @ApiOperation({ summary: 'UPDATE USER' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'User updated.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Patch('/:id')
    async update(@Param() params: ParamIdDto, @Body() updateUserDto: UpdateUserDto) {
        await catchAsync(this.$usersService.update(params.id, updateUserDto));
    }

    /**
     *  @description Deletes user with the specified id
     *  @permissions admins
     *  @statusCodes 204, 404, 400 */
    @ApiOperation({ summary: 'DELETE USER' })
    @ApiBearerAuth()
    @ApiNoContentResponse({ description: 'User deleted.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    async delete(@Param() params: ParamIdDto) {
        await catchAsync(this.$usersService.delete(params.id));
    }
}
