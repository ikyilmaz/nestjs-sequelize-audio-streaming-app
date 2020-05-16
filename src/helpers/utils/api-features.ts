import { TrackFields } from '../../models/track/track.enums';

export const limitFields = (
    fields: string,
    { defaults, _enum }: Partial<{ defaults?: string[], _enum?: any }>,
): string[] => {
    if (fields) {
        const arrFields: string[] = [];

        fields.split(',').forEach(field => {
            let shouldReturn = true;

            if ([...defaults, Object.keys(_enum)].includes(field)) shouldReturn = false;

            if (shouldReturn) return;

            arrFields.push(field);
        });

        return arrFields;

    }

    // ? if defaults exists then return defaults else return all fields
    return defaults ? defaults : Object.keys(_enum);

};

export const paginate = (query: Pick<any, any>, maxLimit: number = 50) => {
    const page = parseInt(query['page']) || 1;
    let limit = parseInt(query['limit']) || 25;

    if (limit > maxLimit) limit = maxLimit;

    const offset = page * limit - limit;

    return { offset, limit };
};
