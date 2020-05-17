import { Module } from '@nestjs/common';
import { FriendshipsController } from './friendships.controller';
import { FriendshipsService } from './friendships.service';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../../../models/user/user.model';
import Friendship from '../../../models/m2m/friendship/friendship.model';

@Module({
    imports: [
        SequelizeModule.forFeature([User, Friendship]),
    ],
    controllers: [FriendshipsController],
    providers: [FriendshipsService],
})
export class FriendshipsModule {
}
