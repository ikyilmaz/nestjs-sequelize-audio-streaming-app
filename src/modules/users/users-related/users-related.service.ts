import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User from '../../../models/user/user.model';
import Album from '../../../models/album/album.model';
import Track from '../../../models/track/track.model';
import { limitPublicUserFields } from '../../../helpers/field-limiters/user.field-limiters';
import { limitAlbumFields } from '../../../helpers/field-limiters/album.field-limiters';
import { limitTrackFields } from '../../../helpers/field-limiters/track.field-limiter';
import {
    GetUserWithAlbumsQueryDto,
    GetUserWithProfileQueryDto,
    GetUserWithTracksQueryDto,
} from '../dto/user-query.dto';
import { UserProfileFields as upf } from '../../../models/user/user-profile/user-profile.enums';
import { limitFields } from '../../../helpers/utils/api-features';
import UserProfile from '../../../models/user/user-profile/user-profile.model';

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

    getUserWithTracks(id: string, query: GetUserWithTracksQueryDto, as: 'tracksOwned' | 'tracksParticipated') {
        return this.$user.findByPk(id, {
            attributes: limitPublicUserFields(query.fields),
            include: [{ model: Track, as, attributes: limitTrackFields(query.trackFields) }],
        });
    }

    getUserWithProfile(id: string, query: GetUserWithProfileQueryDto) {
        return this.$user.findByPk(id, {
            attributes: limitPublicUserFields(query.fields),
            include: [{
                model: UserProfile,
                attributes: limitFields(query.profileFields, { _enum: upf, defaults: [upf.biography] }),
            }],
        });
    }
}
