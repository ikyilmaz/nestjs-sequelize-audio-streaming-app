import { Module } from '@nestjs/common';
import { AlbumsRelatedService } from './albums-related.service';
import { AlbumsRelatedController } from './albums-related.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../../models/user/user.model';
import Album from '../../models/album/album.model';

@Module({
    imports: [SequelizeModule.forFeature([User, Album,])],
    controllers: [AlbumsRelatedController],
    providers: [AlbumsRelatedService],
})
export class AlbumsRelatedModule {
}
