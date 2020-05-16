import { Op, WhereOptions } from 'sequelize';

export const queryObject = (query: Pick<any, any>, fields: string[]): WhereOptions => {
    let where: WhereOptions = {};
    fields.map(fieldKey => {
        // ? Check if the field exists
        if (query[fieldKey]) {

            // * Take the value of the field
            const fieldValue = query[fieldKey];

            // ? Check if value is string or not
            if (typeof fieldValue == 'string') {

                if (!fieldValue.startsWith('-')) {
                    where[fieldKey] = {
                        [Op.like]: fieldValue.endsWith('%25')
                            ? (fieldValue).replace('%25', '%')
                            : fieldValue,
                    };
                }
            }
        }
    });

    return where;
};
