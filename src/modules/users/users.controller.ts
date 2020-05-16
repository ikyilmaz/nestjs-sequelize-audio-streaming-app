import { Body, Controller, Param, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';
import { UsersService } from './users.service';
import { catchAsync } from '../../helpers/utils/catch-async';
import { SendResponse } from '../../helpers/utils/send-response';
import { GetOneQueryDto } from '../../helpers/common-dtos/common-query.dto';
import { GetManyUserQueryDto } from './dto/user-query.dto';
import { Auth } from '../../decorators/auth.decorator';
import { UserRoles as ur } from '../../models/user/user.enums';
import { GetOperation } from '../../decorators/operations/get.decorator';
import { CreateOperation } from '../../decorators/operations/create.decorator';
import { UpdateOperation } from '../../decorators/operations/update.decorator';
import { DeleteOperation } from '../../decorators/operations/delete.decorator';
import { GetManyOperation } from '../../decorators/operations/get-many.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(public $usersService: UsersService) {

    }

    /**
     *  --> GET MANY USER
     *  @description Returns users
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET MANY USER' }) @GetManyOperation()
    async getMany(@Query() query: GetManyUserQueryDto) {
        return SendResponse(await catchAsync(this.$usersService.getMany(query)));
    }

    /**
     *  --> CREATE USER
     * @description Creates user and returns it
     * @permissions admins and moderators
     * @statusCodes 201, 400 */
    @ApiOperation({ summary: 'CREATE USER' }) @Auth({ roles: [ur.admin, ur.moderator] }) @CreateOperation()
    async create(@Body() createUserDto: CreateUserDto) {
        return SendResponse(await catchAsync(this.$usersService.create(createUserDto)));
    }

    /**
     *  --> GET ONE USER BY ID
     *  @description Returns the user with the specified id
     *  @statusCodes 200, 404, 400 */
    @ApiOperation({ summary: 'GET USER' }) @GetOperation()
    async get(@Param() params: ParamIdDto, @Query() query: GetOneQueryDto) {
        return SendResponse(await catchAsync(this.$usersService.get(query, params.id)));
    }

    /**
     *  --> UPDATE ONE USER BY ID
     *  @description Updates user with the specified id
     *  @permissions admins and moderators
     *  @statusCodes 201, 400 */
    @ApiOperation({ summary: 'UPDATE USER' }) @Auth({ roles: [ur.admin, ur.moderator] }) @UpdateOperation()
    async update(@Param() params: ParamIdDto, @Body() updateUserDto: UpdateUserDto) {
        await catchAsync(this.$usersService.update(params.id, updateUserDto));
    }

    /**
     *  --> DELETE ONE USER BY ID
     *  @description Deletes user with the specified id
     *  @permissions admins and moderators
     *  @statusCodes 204, 404, 400 */
    @ApiOperation({ summary: 'DELETE USER' }) @Auth({ roles: [ur.admin, ur.moderator] }) @DeleteOperation()
    async delete(@Param() params: ParamIdDto) {
        await catchAsync(this.$usersService.delete(params.id));
    }
}
