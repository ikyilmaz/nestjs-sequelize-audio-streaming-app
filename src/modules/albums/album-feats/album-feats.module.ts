import { Module } from '@nestjs/common';
import { AlbumFeatsService } from './album-feats.service';
import { AlbumFeatsController } from './album-feats.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import Album from '../../../models/album/album.model';
import User from '../../../models/user/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Album,User])
  ],
  providers: [AlbumFeatsService],
  controllers: [AlbumFeatsController]
})
export class AlbumFeatsModule {}
