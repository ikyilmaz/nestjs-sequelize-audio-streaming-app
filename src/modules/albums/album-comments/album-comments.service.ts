import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CurrentUser } from '@app/current-user';
import { AddCommentDto } from '../../tracks/track-comments/dto/add-comment.dto';
import { ParamIdDto } from '../../../helpers/common-dtos/param-id.dto';
import { UpdateCommentDto } from '../../tracks/track-comments/dto/update-comment.dto';
import AlbumComment from '../../../models/comment/album-comment/album-comment.model';

@Injectable()
export class AlbumCommentsService {
    constructor(
        @InjectModel(AlbumComment) private readonly $albumComment: typeof AlbumComment,
        private readonly $currentUser: CurrentUser,
    ) {
    }

    addComment(id: string, addCommentDto: AddCommentDto) {
        return this.$albumComment.create({
            ownerId: this.$currentUser.getUser.id,
            albumId: id,
            content: addCommentDto.content,
        });
    }

    updateComment({ id }: ParamIdDto, { content }: UpdateCommentDto) {
        return this.$albumComment.update({
            content: content ? content : undefined,
        }, { where: { id }, returning: true });

    }

    removeComment(id: string) {
        return this.$albumComment.destroy({ where: { id } });
    }
}
