import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { CurrentUser } from '@app/current-user';
import Friendship from '../../../models/user/friendship/friendship.model';
import User from '../../../models/user/user.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class FriendshipsService {
    constructor(
        @InjectModel(User) private $user: typeof User,
        @InjectModel(Friendship) private $friendship: typeof Friendship,
        @InjectConnection() private $sequelize: Sequelize,
        private $currentUser: CurrentUser,
    ) {

    }

    follow(id: string) {
        return this.$sequelize.transaction(async transaction => {
            const friend = await this.$user.findByPk(id, { transaction });

            if (!friend) throw new BadRequestException('not found any user');

            const friendship = await this.$currentUser.getUser.$add('friends', friend, {
                through: Friendship,
                transaction,
            });

            if (friendship[0] === 0) throw new BadRequestException('already exists');

            return friendship[0];
        });
    }

    unFollow(id: string) {
        return this.$friendship.destroy({ where: { ownerId: this.$currentUser.getUser.id, friendId: id } });
    }
}
