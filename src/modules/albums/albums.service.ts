import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Album from '../../models/album/album.model';
import { limitFields, paginate } from '../../helpers/utils/api-features';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CurrentUserService } from '@app/current-user';
import User from '../../models/user/user.model';
import Track from '../../models/track/track.model';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { queryObject } from '../../helpers/utils/query-object';
import { GetManyTrackQueryDto } from '../tracks/dto/get-many-track-query.dto';
import { AlbumFields } from '../../models/album/album.enums';
import { GetOneQueryDto } from '../../helpers/common-dtos/common-query.dto';

@Injectable()
export class AlbumsService {
    constructor(@InjectModel(Album) private $album: typeof Album, private $currentUser: CurrentUserService) {
    }

    getMany(query: GetManyTrackQueryDto) {
        return this.$album.findAll({
            ...paginate(query),
            where: queryObject(query, ['title', 'ownerId']),
            attributes: limitFields(query.fields, {
                _enum: AlbumFields,
                defaults: ['id', 'title', 'photo', 'ownerId'],
            }),
        });
    }

    async create(createAlbumDto: CreateAlbumDto) {
        return this.$album.create({
            title: createAlbumDto.title,
            photo: createAlbumDto.photo,
            ownerId: this.$currentUser.getUser.id,
        });
    }

    get(query: GetOneQueryDto, id: string) {
        return this.$album.findByPk(id, {
            attributes: limitFields(query.fields, {
                _enum: AlbumFields,
                defaults: ['id', 'title', 'photo', 'ownerId'],
            }),
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
