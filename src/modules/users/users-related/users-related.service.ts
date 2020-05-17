import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User from '../../../models/user/user.model';
import Album from '../../../models/album/album.model';
import Track from '../../../models/track/track.model';
import { limitAlbumFields } from '../../../helpers/field-limiters/album.field-limiters';
import { UserProfileFields as upf } from '../../../models/user-profile/user-profile.enums';
import { limitFields } from '../../../helpers/utils/api-features';
import UserProfile from '../../../models/user-profile/user-profile.model';
import { FindOptions } from 'sequelize/types';
import { GetOneQueryDto } from 'src/helpers/common-dtos/common-query.dto';

@Injectable()
export class UsersRelatedService {
    constructor(
        @InjectModel(User) private $user: typeof User,
        @InjectModel(Track) private $track: typeof Track,
        @InjectModel(Album) private $album: typeof Album,
        @InjectModel(UserProfile) private $userProfile: typeof UserProfile,
    ) {}

    getAlbums(id: string, query: GetOneQueryDto, as: 'albumsOwned' | 'albumsParticipated') {
        let findOptions: FindOptions = {
            attributes: limitAlbumFields(query.fields),
        };

        // ? if user wants to albums as owner then simply find with ownerId
        if (as == 'albumsOwned') findOptions.where = { ownerId: id };
        // ? if user wants to albums as artist
        else if (as == 'albumsParticipated')
            findOptions.include = [
                {
                    model: User,
                    as: 'artists',
                    attributes: [],
                    required: true,
                    where: { id },
                },
            ];

        return this.$album.findAll(findOptions);
    }

    getTracks(id: string, query: GetOneQueryDto, as: 'tracksOwned' | 'tracksParticipated') {
        let findOptions: FindOptions = {
            attributes: limitAlbumFields(query.fields),
        };

        // ? if user wants to tracks as owner then simply find with ownerId
        if (as == 'tracksOwned') findOptions.where = { ownerId: id };
        // ? if user wants to tracks as artist
        else if (as == 'tracksParticipated')
            findOptions.include = [
                {
                    model: User,
                    as: 'artists',
                    attributes: [],
                    required: true,
                    where: { id },
                },
            ];

        return this.$track.findAll(findOptions);
    }

    getProfile(id: string, query: GetOneQueryDto) {
        return this.$userProfile.findByPk(id, {
            attributes: limitFields(query.fields, { _enum: upf, defaults: [upf.biography] }),
        });
    }
}
