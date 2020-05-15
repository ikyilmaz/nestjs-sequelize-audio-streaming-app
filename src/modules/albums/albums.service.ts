import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Album from '../../models/album/album.model';
import { paginate } from '../../helpers/utils/paginate';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CurrentUserService } from '@app/current-user';
import * as moment from 'moment';
import * as sharp from 'sharp';
import User from '../../models/user/user.model';
import Track from '../../models/track/track.model';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
    constructor(@InjectModel(Album) private $album: typeof Album, private $currentUser: CurrentUserService) {
    }

    getMany(query: Pick<any, any>) {
        return this.$album.findAll({ ...paginate(query), attributes: ['id', 'title', 'photo', 'ownerId'] });
    }

    async create(createAlbumDto: CreateAlbumDto) {
        return this.$album.create({
            title: createAlbumDto.title,
            photo: createAlbumDto.photo,
            ownerId: this.$currentUser.getUser.id,
        });
    }

    get(id: string) {
        return this.$album.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'username'],
                },
                {
                    model: User,
                    as: 'artists',
                    attributes: ['id', 'firstName', 'lastName', 'username'],
                    through: { attributes: [] },
                },
                {
                    model: Track,
                    attributes: ['id', 'title', 'track', 'ownerId'],
                },
            ],
        });
    }

    async update(id: string, updateAlbumDto: UpdateAlbumDto) {
        return this.$album.update(updateAlbumDto, { where: { id } });
    }

    delete(id: string) {
        return this.$album.destroy({ where: { id } });
    }

    async updateAlbumPhoto(id: string, file: Pick<any, any>) {
        await this.saveAlbumPhoto(file);
        this.$album.update({ photo: file.filename }, { where: { id } });
    }

    private async saveAlbumPhoto(file: Pick<any, any>) {
        file.filename = `album-${this.$currentUser.getUser.id}-${moment().unix()}.jpeg`;

        await sharp(file.buffer as Buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`${__dirname}/../public/assets/img/album-images/${file.filename}`);
    }
}
