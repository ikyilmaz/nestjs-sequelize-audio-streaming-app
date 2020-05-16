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
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation, ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';
import { UsersService } from './users.service';
import { catchAsync } from '../../helpers/utils/catch-async';
import { SendResponse } from '../../helpers/utils/send-response';
import { GetManyQueryDto, GetOneQueryDto } from '../../helpers/common-dtos/common-query.dto';
import { AuthRequiredGuard } from '../../guards/auth-required.guard';
import { RestrictToGuard } from '../../guards/restrict-to.guard';
import { GetManyUserQueryDto } from './dto/user-query.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(public $usersService: UsersService) {

    }

    /**
     *  --> GET MANY USER
     *  @description Returns users
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET MANY USER' })
    @ApiOkResponse({ description: 'Users found.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Get('/')
    async getMany(@Query() query: GetManyUserQueryDto) {
        return SendResponse(await catchAsync(this.$usersService.getMany(query)));
    }

    /**
     *  --> CREATE USER
     * @description Creates user and returns it
     * @permissions admins and moderators
     * @statusCodes 201, 400 */
    @ApiOperation({ summary: 'CREATE USER' })
    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'User created.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @SetMetadata('roles', ['admin', 'moderator'])
    @UseGuards(AuthRequiredGuard, RestrictToGuard)
    @Post('/')
    async create(@Body() createUserDto: CreateUserDto) {
        return SendResponse(await catchAsync(this.$usersService.create(createUserDto)));
    }

    /**
     *  --> GET ONE USER BY ID
     *  @description Returns the user with the specified id
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET USER' })
    @ApiOkResponse({ description: 'User found.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @ApiParam({ name: 'id', type: 'UUID' })
    @Get('/:id')
    async get(@Param() params: ParamIdDto, @Query() query: GetOneQueryDto) {
        return SendResponse(await catchAsync(this.$usersService.get(query, params.id)));
    }

    /**
     *  --> UPDATE ONE USER BY ID
     *  @description Updates user with the specified id
     *  @permissions admins and moderators
     *  @statusCodes 201, 400 */
    @ApiOperation({ summary: 'UPDATE USER' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'User updated.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @ApiParam({ name: 'id', type: 'UUID' })
    @SetMetadata('roles', ['admin', 'moderator'])
    @UseGuards(AuthRequiredGuard, RestrictToGuard)
    @Patch('/:id')
    async update(@Param() params: ParamIdDto, @Body() updateUserDto: UpdateUserDto) {
        await catchAsync(this.$usersService.update(params.id, updateUserDto));
    }

    /**
     *  --> DELETE ONE USER BY ID
     *  @description Deletes user with the specified id
     *  @permissions admins and moderators
     *  @statusCodes 204, 404, 400 */
    @ApiOperation({ summary: 'DELETE USER' })
    @ApiBearerAuth()
    @ApiNoContentResponse({ description: 'User deleted.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiNotFoundResponse({ description: 'Not found any user.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @ApiParam({ name: 'id', type: 'UUID' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @SetMetadata('roles', ['admin', 'moderator'])
    @UseGuards(AuthRequiredGuard, RestrictToGuard)
    @Delete('/:id')
    async delete(@Param() params: ParamIdDto) {
        await catchAsync(this.$usersService.delete(params.id));
    }
}
