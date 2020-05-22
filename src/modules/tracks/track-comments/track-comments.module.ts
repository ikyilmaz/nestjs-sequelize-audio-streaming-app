import { Module } from '@nestjs/common';
import { TrackCommentsService } from './track-comments.service';
import { TrackCommentsController } from './track-comments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import TrackComment from '../../../models/comment/track-comment/track-comment.model';
import User from '../../../models/user/user.model';

@Module({
    imports: [
        SequelizeModule.forFeature([TrackComment, User]),
    ],
    providers: [TrackCommentsService],
    controllers: [TrackCommentsController],
})
export class TrackCommentsModule {
}
