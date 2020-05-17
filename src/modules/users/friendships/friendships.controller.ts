import { Controller, Param } from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { CreateOperation } from '../../../decorators/operations/create.decorator';
import { Auth } from '../../../decorators/auth.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { SendResponse } from '../../../helpers/utils/send-response';
import { catchAsync } from '../../../helpers/utils/catch-async';
import { DeleteOperation } from '../../../decorators/operations/delete.decorator';

@Controller('users')
@ApiTags('users')
export class FriendshipsController {
    constructor(private $friendshipsService: FriendshipsService) {

    }

    @ApiOperation({ description: 'FOLLOW A USER' }) @Auth() @CreateOperation('/:id/add-friend')
    async create(@Param() params: ParamIdDto) {
        return SendResponse(await catchAsync(this.$friendshipsService.follow(params.id)));
    }


    @ApiOperation({ description: 'REMOVE FROM FRIENDS' }) @Auth() @DeleteOperation('/:id/remove-friend')
    async delete(@Param() params: ParamIdDto) {
        await catchAsync(this.$friendshipsService.unFollow(params.id));
    }

}
