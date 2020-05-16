import { limitFields } from '../utils/api-features';
import { UserFields as uf } from '../../models/user/user.enums';

export const limitPublicUserFields = (fields: string) => limitFields(fields, {
    _enum: uf,
    defaults: [uf.id, uf.firstName, uf.lastName, uf.username],
    disallowedFields: [uf.password, uf.passwordChangedAt, uf.email, uf.role, uf.createdAt, uf.updatedAt],
});