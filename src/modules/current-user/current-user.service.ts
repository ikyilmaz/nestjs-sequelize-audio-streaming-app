import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import UserProfile from '../../models/user/user-profile/user-profile.model';
import Track from '../../models/track/track.model';
import Album from '../../models/album/album.model';
import { CurrentUser } from '@app/current-user';
import User from '../../models/user/user.model';
import { limitFields } from '../../helpers/utils/api-features';
import {
    GetCurrentUserQueryDto,
    GetCurrentUsersAlbumsQueryDto,
    GetCurrentUsersTracksQueryDto,
} from './dto/current-user-query.dto';
import { UserFields as uf } from '../../models/user/user.enums';
import { UserProfileFields as upf } from '../../models/user/user-profile/user-profile.enums';
import { AlbumFields as af } from '../../models/album/album.enums';
import { TrackFields as tf } from '../../models/track/track.enums';
import { GetOneQueryDto } from '../../helpers/common-dtos/common-query.dto';
import { limitAlbumFields } from '../../helpers/field-limiters/album.field-limiters';
import { queryObject } from '../../helpers/utils/query-object';
import { limitTrackFields } from '../../helpers/field-limiters/track.field-limiter';

@Injectable()
export class CurrentUserService {
    constructor(
        @InjectModel(User) private $user: typeof User,
        @InjectModel(UserProfile) private $userProfile: typeof UserProfile,
        @InjectModel(Track) private $track: typeof Track,
        @InjectModel(Album) private $album: typeof Album,
        private $currentUser: CurrentUser,
    ) {

    }

    getCurrentUser(id: string, query: GetCurrentUserQueryDto) {
        return this.$user.findByPk(id, {
            attributes: limitFields(query.fields, {
                _enum: uf,
                defaults: [uf.id, uf.firstName, uf.lastName, uf.username],
                must: [uf.passwordChangedAt],
                disallowedFields: [uf.password],
            }),
        });
    }

    getProfile(query: GetOneQueryDto) {
        return this.$userProfile.findByPk(this.$currentUser.getUser.id, {
            attributes: limitFields(query.fields, {
                _enum: upf,
                defaults: [upf.biography],
            }),
        });
    }

    getAlbums(query: GetCurrentUsersAlbumsQueryDto) {
        return this.$album.findAll({
            attributes: limitAlbumFields(query.fields),
            where: {
                ...queryObject(query, [af.title]),
                ownerId: this.$currentUser.getUser.id,
            },
        });
    }

    getTracks(query: GetCurrentUsersTracksQueryDto) {
        return this.$track.findAll({
            attributes: limitTrackFields(query.fields),
            where: {
                ...queryObject(query, [tf.title, tf.albumId]),
                ownerId: this.$currentUser.getUser.id,
            },
        });
    }
}
