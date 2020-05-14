import { ModelScopeOptions } from 'sequelize';

export const userScopes: ModelScopeOptions = {
    public: {
        attributes: { exclude: ['email', 'password', 'updatedAt'] },
    },
    private: {
        attributes: { exclude: ['password'] },
    },
};
