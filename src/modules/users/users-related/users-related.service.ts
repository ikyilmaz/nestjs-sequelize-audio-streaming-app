import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User from '../../../models/user/user.model';
import { limitPublicUserFields } from '../../../helpers/field-limiters/user.field-limiters';
import Album from '../../../models/album/album.model';
import { limitAlbumFields } from '../../../helpers/field-limiters/album.field-limiters';
import { GetUserWithAlbumsQueryDto } from '../dto/user-query.dto';

@Injectable()
export class UsersRelatedService {
    constructor(@InjectModel(User) private $user: typeof User) {

    }

    getUserWithAlbums(id: string, query: GetUserWithAlbumsQueryDto, as: 'albumsOwned' | 'albumsParticipated') {
        return this.$user.findByPk(id, {
            attributes: limitPublicUserFields(query.fields),
            include: [{ model: Album, as, attributes: limitAlbumFields(query.albumFields) }],
        });
    }

    getUserWithTracks(id: string, query: GetUserWithAlbumsQueryDto, as: 'tracksOwned' | 'tracksParticipated') {
        return this.$user.findByPk(id, {
            attributes: limitPublicUserFields(query.fields),
            include: [{ model: Album, as, attributes: limitAlbumFields(query.albumFields) }],
        });
    }
}
