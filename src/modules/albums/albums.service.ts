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
import { GetManyTrackQueryDto } from '../tracks/dto/track-query.dto';
import { AlbumFields as af } from '../../models/album/album.enums';
import { limitAlbumFields } from '../../helpers/field-limiters/album.field-limiters';
import { GetOneAlbumQueryDto } from './dto/album-query.dto';
import { limitPublicUserFields } from '../../helpers/field-limiters/user.field-limiters';
import { limitTrackFields } from '../../helpers/field-limiters/track.field-limiter';

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

    create(createAlbumDto: CreateAlbumDto) {
        return this.$album.create({
            title: createAlbumDto.title,
            photo: createAlbumDto.photo,
            ownerId: this.$currentUser.getUser.id,
        });
    }

    get(query: GetOneAlbumQueryDto, id: string) {
        return this.$album.findByPk(id, {
            attributes: limitAlbumFields(query.fields),
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: limitPublicUserFields(query.ownerFields),
                },
                {
                    model: User,
                    as: 'artists',
                    attributes: limitPublicUserFields(query.ownerFields),
                    through: { attributes: [] },
                },
                {
                    model: Track,
                    attributes: limitTrackFields(query.trackFields),
                },
            ],
        });
    }

    update(id: string, updateAlbumDto: UpdateAlbumDto) {
        return this.$album.update(updateAlbumDto, { where: { id } });
    }

    delete(id: string) {
        return this.$album.destroy({ where: { id } });
    }
}
