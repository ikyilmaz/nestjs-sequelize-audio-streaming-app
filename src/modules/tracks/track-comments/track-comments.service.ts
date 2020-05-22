import { Injectable } from '@nestjs/common';
import { AddCommentDto } from './dto/add-comment.dto';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/sequelize';
import TrackComment from '../../../models/comment/track-comment/track-comment.model';
import { CurrentUser } from '@app/current-user';

@Injectable()
export class TrackCommentsService {
    constructor(
        @InjectModel(TrackComment) private readonly $trackComment: typeof TrackComment,
        private readonly $currentUser: CurrentUser,
    ) {}

    addComment(id: string, addCommentDto: AddCommentDto) {
        return this.$trackComment.create({
            ownerId: this.$currentUser.getUser.id,
            trackId: id,
            content: addCommentDto.content,
            second: addCommentDto.second,
        });
    }

    updateComment({ id }: ParamIdDto, { content, second }: UpdateCommentDto) {
        return this.$trackComment.update({
            content: content ? content : undefined,
            second: second ? second : undefined,
        }, { where: { id: id }, returning: true });

    }

    removeComment(id: string) {
        return this.$trackComment.destroy({
            where: { ownerId: this.$currentUser.getUser.id, trackId: id },
        });
    }
}
