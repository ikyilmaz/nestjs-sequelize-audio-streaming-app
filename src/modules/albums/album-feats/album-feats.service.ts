import { Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import AlbumFeaturing from '../../../models/m2m/featuring/album-featuring/album-featuring.model';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import Album from '../../../models/album/album.model';
import { Sequelize } from 'sequelize-typescript';
import { CurrentUser } from '@app/current-user';
import User from '../../../models/user/user.model';
import { AddArtistsDto } from './dto/add-artists.dto';
import { RemoveArtistsDto } from './dto/remove-artists.dto';

@Injectable()
export class AlbumFeatsService {

    constructor(
        @InjectConnection() private readonly $sequelize: Sequelize,
        @InjectModel(Album) private readonly $album: typeof Album,
        @InjectModel(User) private readonly  $user: typeof User,
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
            const album = await this.$album.findByPk(id, { transaction });

            // ? If it is not exists then throw error
            if (!album) throw new NotFoundException('not found any album');

            // * Find artists
            const artists = await this.$user.findAll({ where: { id: { [Op.in]: artistIds } }, transaction });

            // ? If no artist found then throw error
            if (artists.length == 0) throw new NotFoundException('not found any user');

            await album.$add('artists', artists, { transaction, through: AlbumFeaturing });
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
            const album = await this.$album.findByPk(id, { transaction });

            // ? If it is not exists then throw error
            if (!album) throw new NotFoundException('not found any album');

            await album.$remove('artists', artistIds, { transaction, through: AlbumFeaturing });
        });
    }
}
