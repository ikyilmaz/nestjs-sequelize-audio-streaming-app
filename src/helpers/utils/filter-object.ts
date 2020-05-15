/**
 * @description removes unwanted fields in the given object
 * */
export const filterObject = <T extends object>(obj: T, fields: string[], allowed: boolean = false) => {
    if (allowed) {
        //@ts-ignore
        const newObj: T = {};
        Object.keys(obj).forEach(el => (fields.includes(el) ? (newObj[el] = obj[el]) : null));
        return newObj;
    }

    fields.forEach(field => obj[field] = undefined);

    return obj
};
