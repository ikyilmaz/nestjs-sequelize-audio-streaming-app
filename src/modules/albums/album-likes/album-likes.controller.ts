import { Controller, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../../decorators/auth.decorator';
import { CreateOperation } from '../../../decorators/operations/create.decorator';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { SendResponse } from '../../../helpers/utils/send-response';
import { catchAsync } from '../../../helpers/utils/catch-async';
import { DeleteOperation } from '../../../decorators/operations/delete.decorator';
import { AlbumLikesService } from './album-likes.service';

@Controller('albums')
@ApiTags("albums")
export class AlbumLikesController {
    constructor(private readonly $albumLikesService: AlbumLikesService) {
    }

    /**
     * --> ADD LIKE
     * @description adds a like to the specified album
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'ADD LIKE' }) @Auth() @CreateOperation('/:id/likes')
    async addLike(@Param() params: ParamIdDto) {
        return SendResponse(await catchAsync(this.$albumLikesService.addLike(params.id)));
    }

    /**
     * --> REMOVE LIKE
     * @description removes a like to the specified album
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'REMOVE LIKE' }) @Auth() @DeleteOperation('/:id/likes')
    async removeLike(@Param() params: ParamIdDto) {
        await catchAsync(this.$albumLikesService.removeLike(params.id));
    }
}
