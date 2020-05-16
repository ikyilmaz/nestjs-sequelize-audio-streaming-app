import { limitFields } from '../utils/api-features';
import { AlbumFields as af } from '../../models/album/album.enums';

export const limitAlbumFields = (fields: string) => limitFields(fields, {
    _enum: af,
    defaults: [af.id, af.title, af.photo, af.ownerId],
})