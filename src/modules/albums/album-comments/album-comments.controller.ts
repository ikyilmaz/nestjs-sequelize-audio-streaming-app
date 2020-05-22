import { Body, Controller, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../../decorators/auth.decorator';
import { CreateOperation } from '../../../decorators/operations/create.decorator';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { AddCommentDto } from '../../tracks/track-comments/dto/add-comment.dto';
import { SendResponse } from '../../../helpers/utils/send-response';
import { catchAsync } from '../../../helpers/utils/catch-async';
import { UpdateOperation } from '../../../decorators/operations/update.decorator';
import { UpdateCommentDto } from '../../tracks/track-comments/dto/update-comment.dto';
import { DeleteOperation } from '../../../decorators/operations/delete.decorator';
import { AlbumCommentsService } from './album-comments.service';
import AlbumComment from '../../../models/comment/album-comment/album-comment.model';

@Controller('albums')
@ApiTags('albums')
export class AlbumCommentsController {

    constructor(private readonly $albumCommentsService: AlbumCommentsService) {

    }

    /**
     * --> ADD COMMENT
     * @description adds a comment to the specified album
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'ADD COMMENT' }) @Auth() @CreateOperation('/:id/comments')
    async addComment(@Param() params: ParamIdDto, @Body() addCommentDto: AddCommentDto) {
        return SendResponse(await catchAsync(this.$albumCommentsService.addComment(params.id, addCommentDto)));
    }

    /**
     * --> UPDATE COMMENT
     * @description updates the comment of the specified album
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'UPDATE COMMENT' }) @Auth({ isOwner: AlbumComment }) @UpdateOperation('/comments/:id')
    async updateComment(@Param() params: ParamIdDto, @Body() updateCommentDto: UpdateCommentDto) {
        return SendResponse(await catchAsync(this.$albumCommentsService.updateComment(params, updateCommentDto)));
    }

    /**
     * --> REMOVE COMMENT
     * @description removes a comment to the specified album
     * @permissions authenticated users
     * @statusCodes 204, 400, 404 */
    @ApiOperation({ summary: 'REMOVE COMMENT' }) @Auth({ isOwner: AlbumComment }) @DeleteOperation('/comments/:id')
    async removeComment(@Param() params: ParamIdDto) {
        await catchAsync(this.$albumCommentsService.removeComment(params.id));
    }
}
