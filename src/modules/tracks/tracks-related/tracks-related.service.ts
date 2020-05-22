import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CurrentUser } from '@app/current-user';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import Track from '../../../models/track/track.model';
import { AddArtistsDto } from '../../albums/albums-related/dto/add-artists.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import User from '../../../models/user/user.model';
import TrackFeaturing from '../../../models/m2m/featuring/track-featuring/track-featuring.model';
import { RemoveArtistsDto } from '../../albums/albums-related/dto/remove-artists.dto';
import TrackLike from '../../../models/m2m/like/track-like/track-like.model';
import TrackComment from '../../../models/comment/track-comment/track-comment.model';
import { AddCommentDto } from './dto/add-comment.dto';

@Injectable()
export class TracksRelatedService {
    constructor(
        @InjectModel(Track) private readonly $track: typeof Track,
        @InjectModel(User) private readonly $user: typeof User,
        @InjectModel(TrackComment) private readonly $trackComment: typeof TrackComment,
        @InjectModel(TrackLike) private readonly $trackLike: typeof TrackLike,
        @InjectConnection() private readonly $sequelize: Sequelize,
        private readonly $currentUser: CurrentUser,
    ) {

    }

    addArtists(id: string, addArtistsDto: AddArtistsDto) {
        const artistIds = addArtistsDto.artists
            // * Get artist ids
            .map((artist) => artist.id)
            // * Make array unique
            .filter((artistId, index, self) => self.indexOf(artistId) === index && this.$currentUser.getUser.id != artistId);

        // ? after filtering
        if (artistIds.length == 0) throw new NotFoundException('not found any user');

        return this.$sequelize.transaction(async transaction => {
            // * Find the album
            const track = await this.$track.findByPk(id, { transaction });

            // ? If it is not exists then throw error
            if (!track) throw new NotFoundException('not found any album');

            // * Find artists
            const artists = await this.$user.findAll({ where: { id: { [Op.in]: artistIds } }, transaction });

            // ? If no artist found then throw error
            if (artists.length == 0) throw new NotFoundException('not found any user');

            return track.$add('artists', artists, { transaction, through: TrackFeaturing });
        });

    }

    removeArtists(id: string, removeArtistsDto: RemoveArtistsDto) {
        const artistIds = removeArtistsDto.artists
            // * Get artist ids
            .map((artist) => artist.id)
            // * Make array unique
            .filter((artistId, index, self) => self.indexOf(artistId) === index && this.$currentUser.getUser.id != artistId);

        // ? after filtering
        if (artistIds.length == 0) throw new NotFoundException('not found any user');

        return this.$sequelize.transaction(async transaction => {
            // * Find the album
            const track = await this.$track.findByPk(id, { transaction });

            // ? If it is not exists then throw error
            if (!track) throw new NotFoundException('not found any album');

            await track.$remove('artists', artistIds, { transaction, through: TrackFeaturing });
        });
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

    addComment(id: string, addCommentDto: AddCommentDto) {
        return this.$trackComment.create({
            ownerId: this.$currentUser.getUser.id,
            trackId: id,
            content: addCommentDto.content,
            second: addCommentDto.second,
        });
    }

    removeComment(id: string) {
        return this.$trackComment.destroy({
            where: { ownerId: this.$currentUser.getUser.id, trackId: id },
        });
    }

    incrementListenCount(filename: string) {
        return this.$track.increment('listenCount', { by: 1, where: { track: filename } });
    }

}
