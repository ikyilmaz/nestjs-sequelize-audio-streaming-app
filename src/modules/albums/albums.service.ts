import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Album from '../../models/album/album.model';
import { paginate } from '../../helpers/utils/api-features';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CurrentUserService } from '@app/current-user';
import User from '../../models/user/user.model';
import Track from '../../models/track/track.model';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
    constructor(@InjectModel(Album) private $album: typeof Album, private $currentUser: CurrentUserService) {
    }

    getMany(query: Pick<any, any>) {
        return this.$album.findAll({
            ...paginate(query),
            attributes: ['id', 'title', 'photo', 'ownerId']
        });
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
}
