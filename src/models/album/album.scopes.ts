import User from '../user/user.model';
import { FindOptions, ModelScopeOptions } from 'sequelize';

export const defaultAlbumScope: FindOptions = {
    attributes: { exclude: ['deletedAt'] },
};

export const albumScopes: ModelScopeOptions = {
    'with-owner-and-artists': {
        include: [
            {
                model: User,
                attributes: [
                    'id',
                    'firstName',
                    'lastName',
                    'username',
                    'photo',
                ],
                as: 'owner',
            },
            {
                model: User,
                attributes: [
                    'id',
                    'firstName',
                    'lastName',
                    'username',
                    'photo',
                ],
                as: 'artists',
            },
        ],
    },
};
