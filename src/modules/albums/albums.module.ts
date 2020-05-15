import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { SequelizeModule } from '@nestjs/sequelize';
import Album from '../../models/album/album.model';
import User from '../../models/user/user.model';
import { AlbumsRelatedModule } from './albums-related/albums-related.module';

@Module({
    imports: [
        AlbumsRelatedModule,
        SequelizeModule.forFeature([User, Album])
    ],
    controllers: [AlbumsController],
    providers: [AlbumsService],

})
export class AlbumsModule {}
