import { Module } from '@nestjs/common';
import { AlbumLikesService } from './album-likes.service';
import { AlbumLikesController } from './album-likes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import Album from '../../../models/album/album.model';
import User from '../../../models/user/user.model';

@Module({
  imports: [
      SequelizeModule.forFeature([Album, User])
  ],
  providers: [AlbumLikesService],
  controllers: [AlbumLikesController]
})
export class AlbumLikesModule {}
