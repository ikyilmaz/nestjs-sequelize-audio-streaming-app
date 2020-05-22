import { Controller, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../../decorators/auth.decorator';
import { CreateOperation } from '../../../decorators/operations/create.decorator';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { SendResponse } from '../../../helpers/utils/send-response';
import { catchAsync } from '../../../helpers/utils/catch-async';
import TrackLike from '../../../models/m2m/like/track-like/track-like.model';
import { DeleteOperation } from '../../../decorators/operations/delete.decorator';
import { TrackLikesService } from './track-likes.service';

@Controller('tracks')
@ApiTags("tracks")
export class TrackLikesController {
    constructor(private readonly $trackLikesService: TrackLikesService) {
    }

    /**
     * --> ADD LIKE
     * @description adds a like to the specified track
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'ADD LIKE' }) @Auth() @CreateOperation('/:id/likes')
    async addLike(@Param() params: ParamIdDto) {
        return SendResponse(await catchAsync(this.$trackLikesService.addLike(params.id)));
    }

    /**
     * --> REMOVE LIKE
     * @description removes a like to the specified track
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'REMOVE LIKE' }) @Auth({ isOwner: TrackLike }) @DeleteOperation('/:id/likes')
    async removeLike(@Param() params: ParamIdDto) {
        await catchAsync(this.$trackLikesService.removeLike(params.id));
    }
}
