import { Body, Controller, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '../../../decorators/auth.decorator';
import { CreateOperation } from '../../../decorators/operations/create.decorator';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { SendResponse } from '../../../helpers/utils/send-response';
import { catchAsync } from '../../../helpers/utils/catch-async';
import TrackComment from '../../../models/comment/track-comment/track-comment.model';
import { UpdateOperation } from '../../../decorators/operations/update.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DeleteOperation } from '../../../decorators/operations/delete.decorator';
import { TrackCommentsService } from './track-comments.service';

@Controller('track-comments')
export class TrackCommentsController {

    constructor(private readonly $trackCommentsService: TrackCommentsService) {

    }

    /**
     * --> ADD COMMENT
     * @description adds a comment to the specified track
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'ADD COMMENT' }) @Auth() @CreateOperation('/:id/comments')
    async addComment(@Param() params: ParamIdDto, @Body() addCommentDto: AddCommentDto) {
        return SendResponse(await catchAsync(this.$trackCommentsService.addComment(params.id, addCommentDto)));
    }

    /**
     * --> UPDATE COMMENT
     * @description updates the comment of the specified track
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'UPDATE COMMENT' }) @Auth({ isOwner: TrackComment }) @UpdateOperation('comments/:id')
    async updateComment(@Param() params: ParamIdDto, @Body() updateCommentDto: UpdateCommentDto) {
        return SendResponse(await catchAsync(this.$trackCommentsService.updateComment(params, updateCommentDto)));
    }

    /**
     * --> REMOVE COMMENT
     * @description removes a comment to the specified track
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'REMOVE COMMENT' }) @Auth({ isOwner: TrackComment }) @DeleteOperation('/:id/comments')
    async removeComment(@Param() params: ParamIdDto) {
        await catchAsync(this.$trackCommentsService.removeComment(params.id));
    }
}
