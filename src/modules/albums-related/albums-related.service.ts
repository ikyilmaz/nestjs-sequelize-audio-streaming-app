import { Injectable, NotFoundException } from '@nestjs/common';
import * as moment from 'moment';
import * as sharp from 'sharp';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import Album from '../../models/album/album.model';
import { CurrentUserService } from '@app/current-user';
import { AddArtistsDto } from './dto/add-artists.dto';
import { Sequelize } from 'sequelize-typescript';
import User from '../../models/user/user.model';
import { Op } from 'sequelize';
import UserAlbum from '../../models/m2m/useralbum.model';
import { RemoveArtistsDto } from './dto/remove-artists.dto';

@Injectable()
export class AlbumsRelatedService {

    constructor(
        @InjectModel(Album) private $album: typeof Album,
        @InjectModel(User) private $user: typeof User,
        @InjectConnection() private $sequelize: Sequelize,
        private $currentUser: CurrentUserService,
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

            await album.$add('artists', artists, { transaction, through: UserAlbum });
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

            await album.$remove('artists', artistIds, { transaction, through: UserAlbum });
        });
    }

    async updateAlbumPhoto(id: string, file: Pick<any, any>) {
        file.filename = `album-${this.$currentUser.getUser.id}-${moment().unix()}.jpeg`;

        await sharp(file.buffer as Buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`${__dirname}/../public/assets/img/album-images/${file.filename}`);

        return this.$album.update({ photo: file.filename }, { where: { id } });
    }
}
