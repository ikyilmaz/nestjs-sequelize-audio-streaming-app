import { ModelScopeOptions } from 'sequelize';
import User from '../user/user.model';
import Album from '../album/album.model';

export const trackScopes: ModelScopeOptions = {
    'with-album-owner-and-artists': {
        include: [
            {
                model: Album,
                attributes: ['title'],
                include: [
                    {
                        model: User,
                        as: 'owner',
                        attributes: ['id', 'firstName', 'lastName', 'username', 'photo']
                    }
                ]
            },
            {
                model: User,
                as: 'owner',
                attributes: ['id', 'firstName', 'lastName', 'username', 'photo']
            },
            {
                model: User,
                as: 'artists',
                attributes: ['id', 'firstName', 'lastName', 'username', 'photo']
            }
        ]
    }
};