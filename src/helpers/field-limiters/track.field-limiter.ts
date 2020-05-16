import { limitFields } from '../utils/api-features';
import { TrackFields as tf } from '../../models/track/track.enums';

export const limitTrackFields = (fields: string) => limitFields(fields, {
    _enum: tf,
    defaults: [tf.id, tf.title, tf.albumId, tf.ownerId],
});