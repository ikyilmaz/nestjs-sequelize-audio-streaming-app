import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrentUserService } from '@app/current-user';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import Track from '../../../models/track/track.model';
import { AddArtistsDto } from '../../albums/albums-related/dto/add-artists.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import User from '../../../models/user/user.model';
import UserTrack from '../../../models/m2m/usertrack.model';
import { RemoveArtistsDto } from '../../albums/albums-related/dto/remove-artists.dto';

@Injectable()
export class TracksRelatedService {
    constructor(
        @InjectModel(Track) private $track: typeof Track,
        @InjectModel(User) private $user: typeof User,
        @InjectConnection() private $sequelize: Sequelize,
        private $currentUser: CurrentUserService,
    ) {}

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

            await track.$add('artists', artists, { transaction, through: UserTrack });
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

            await track.$remove('artists', artistIds, { transaction, through: UserTrack });
        });
    }

}
