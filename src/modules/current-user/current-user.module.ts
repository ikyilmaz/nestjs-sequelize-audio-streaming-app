import { Module } from '@nestjs/common';
import { CurrentUserService } from './current-user.service';
import { CurrentUserController } from './current-user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../../models/user/user.model';
import UserProfile from '../../models/user-profile/user-profile.model';
import Album from '../../models/album/album.model';
import Track from '../../models/track/track.model';

@Module({
    imports: [
        SequelizeModule.forFeature([User, UserProfile, Album, Track]),
    ],
    providers: [CurrentUserService],
    controllers: [CurrentUserController],
})
export class CurrentUserModule {
}
