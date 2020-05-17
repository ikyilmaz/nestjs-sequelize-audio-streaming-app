export const limitFields = (
    fields: string,
    { defaults = [], _enum, disallowedFields = [], must = [] }: Partial<{
        defaults?: string[],
        _enum?: any,
        disallowedFields: string[],
        must?: string[]
    }>,
): string[] => {
    if (fields) {
        const arrFields: string[] = [];


        fields.split(',').forEach(field => {
            if (disallowedFields.includes(field) || !Object.keys(_enum).includes(field)) return;

            arrFields.push(field);
        });

        if (must.length > 0) must.forEach(field => arrFields.push(field));

        // ? if length is more than 0 then return arrFields else return defaults.
        // !                                                                          Make array unique
        if (arrFields.length > 0) return arrFields.filter((arrField, index, self) => self.indexOf(arrField) === index);

        // ? If defaults do not exists then return all fields
        else if (defaults) return defaults;

        return Object.keys(_enum);

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
