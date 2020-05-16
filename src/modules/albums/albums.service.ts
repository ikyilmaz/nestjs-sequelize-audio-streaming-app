import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Album from '../../models/album/album.model';
import { paginate } from '../../helpers/utils/api-features';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CurrentUserService } from '@app/current-user';
import User from '../../models/user/user.model';
import Track from '../../models/track/track.model';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { queryObject } from '../../helpers/utils/query-object';
import { GetManyTrackQueryDto } from '../tracks/dto/get-many-track-query.dto';
import { AlbumFields as af } from '../../models/album/album.enums';
import { UserFields as uf } from '../../models/user/user.enums';
import { TrackFields as tf } from '../../models/track/track.enums';
import { GetOneQueryDto } from '../../helpers/common-dtos/common-query.dto';
import { limitAlbumFields } from '../../helpers/field-limiters/album.field-limiters';

@Injectable()
export class AlbumsService {
    constructor(@InjectModel(Album) private $album: typeof Album, private $currentUser: CurrentUserService) {

    }

    getMany(query: GetManyTrackQueryDto) {
        return this.$album.findAll({
            ...paginate(query),
            where: queryObject(query, [af.title, af.ownerId]),
            attributes: limitAlbumFields(query.fields),
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
            attributes: limitAlbumFields(query.fields),
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: [uf.id, uf.firstName, uf.lastName, uf.username],
                },
                {
                    model: User,
                    as: 'artists',
                    attributes: [uf.id, uf.firstName, uf.lastName, uf.username],
                    through: { attributes: [] },
                },
                {
                    model: Track,
                    attributes: [tf.id, tf.title, tf.track, tf.ownerId],
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
