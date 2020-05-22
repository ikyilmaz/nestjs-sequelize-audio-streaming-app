import { Injectable, NotFoundException } from '@nestjs/common';
import { AddArtistsDto } from '../../albums/albums-related/dto/add-artists.dto';
import { Op } from 'sequelize';
import TrackFeaturing from '../../../models/m2m/featuring/track-featuring/track-featuring.model';
import { RemoveArtistsDto } from '../../albums/albums-related/dto/remove-artists.dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import Track from '../../../models/track/track.model';
import User from '../../../models/user/user.model';
import { CurrentUser } from '@app/current-user';

@Injectable()
export class TrackFeatsService {
    constructor(
        @InjectConnection() private readonly $sequelize: Sequelize,
        @InjectModel(Track) private readonly $track: typeof Track,
        @InjectModel(User) private readonly $user: typeof User,
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
}
