import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import AlbumLike from '../../../models/m2m/like/album-like/album-like.model';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import Album from '../../../models/album/album.model';
import { Sequelize } from 'sequelize-typescript';
import { CurrentUser } from '@app/current-user';

@Injectable()
export class AlbumLikesService {

    constructor(
        @InjectModel(Album) private readonly $album: typeof Album,
        @InjectConnection() private readonly $sequelize: Sequelize,
        private readonly $currentUser: CurrentUser,
    ) {
    }

    addLike(id: string) {
        return this.$sequelize.transaction(async transaction => {
            const album = await this.$album.findByPk(id, { transaction });

            if (!album) throw new NotFoundException();

            const like = await album.$add('usersLiked', this.$currentUser.getUser, { transaction, through: AlbumLike });

            if (!like) throw new BadRequestException('already exists');

            return like;
        });
    }

    removeLike(id: string) {
        return this.$sequelize.transaction(async transaction => {
            const track = await this.$album.findByPk(id, { transaction });

            if (!track) throw new NotFoundException();

            return track.$remove('usersLiked', this.$currentUser.getUser, { transaction, through: AlbumLike });
        });
    }
}
