import { Module } from '@nestjs/common';
import { UsersRelatedService } from './users-related.service';
import { UsersRelatedController } from './users-related.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../../../models/user/user.model';
import Track from 'src/models/track/track.model';
import Album from 'src/models/album/album.model';
import UserProfile from 'src/models/user/user-profile/user-profile.model';

@Module({
    imports: [SequelizeModule.forFeature([User, Track, Album, UserProfile])],
    providers: [UsersRelatedService],
    controllers: [UsersRelatedController],
})
export class UsersRelatedModule {}
