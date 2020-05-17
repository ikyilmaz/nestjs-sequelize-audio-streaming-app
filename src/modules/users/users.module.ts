import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersRelatedModule } from './users-related/users-related.module';
import { FriendshipsModule } from './friendships/friendships.module';
import User from '../../models/user/user.model';

@Module({
    imports: [SequelizeModule.forFeature([User]), UsersRelatedModule, FriendshipsModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
