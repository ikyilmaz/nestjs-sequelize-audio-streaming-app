import { Module } from '@nestjs/common';
import { AlbumCommentsService } from './album-comments.service';
import { AlbumCommentsController } from './album-comments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import AlbumComment from '../../../models/comment/album-comment/album-comment.model';
import User from '../../../models/user/user.model';

@Module({
  imports: [
      SequelizeModule.forFeature([AlbumComment, User])
  ],
  providers: [AlbumCommentsService],
  controllers: [AlbumCommentsController]
})
export class AlbumCommentsModule {}
