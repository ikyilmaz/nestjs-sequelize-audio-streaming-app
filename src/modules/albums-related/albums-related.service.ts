import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as sharp from 'sharp';
import { InjectModel } from '@nestjs/sequelize';
import Album from '../../models/album/album.model';
import { CurrentUserService } from '@app/current-user';
import { AddArtistsDto } from './dto/add-artists.dto';

@Injectable()
export class AlbumsRelatedService {

    constructor(
        @InjectModel(Album) private $album: typeof Album,
        private $currentUser: CurrentUserService,
    ) {

    }

    addArtists(id: string, addArtistsDto: AddArtistsDto) {
        const artistsAlbums = addArtistsDto.artists
            .map((artist) => artist.id) // * Get artist ids
            .filter((artistId, index, self) => self.indexOf(artistId) === index && this.$currentUser.getUser.id != artistId) // * Make array unique
            .map(artistId => ({ albumId: id, artistId: artistId })); // * Prepare for bulkCreate

        console.log(artistsAlbums);
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
