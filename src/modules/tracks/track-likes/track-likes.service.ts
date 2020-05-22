import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import TrackLike from '../../../models/m2m/like/track-like/track-like.model';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CurrentUser } from '@app/current-user';
import Track from '../../../models/track/track.model';

@Injectable()
export class TrackLikesService {
    constructor(
        @InjectConnection() private readonly $sequelize: Sequelize,
        @InjectModel(Track) private readonly $track: typeof Track,
        @InjectModel(TrackLike) private readonly $trackLike: typeof TrackLike,
        private readonly $currentUser: CurrentUser,
    ) {
    }

    addLike(id: string) {
        return this.$sequelize.transaction(async transaction => {
            const track = await this.$track.findByPk(id, { transaction });

            if (!track) throw new NotFoundException();

            const like = await track.$add('usersLiked', this.$currentUser.getUser, { transaction, through: TrackLike });

            if (!like) throw new BadRequestException('already exists');

            return like;
        });
    }

    removeLike(id: string) {
        return this.$trackLike.destroy({
            where: { ownerId: this.$currentUser.getUser.id, trackId: id },
        });
    }

}
