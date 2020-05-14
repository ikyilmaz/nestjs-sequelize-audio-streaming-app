/**
 * @description removes unwanted fields in the given object
 * */
export const filterObject = (obj: Pick<any, any>, fields: string[], allowed: boolean = false) => {
    if (allowed) {
        const newObj: Pick<any, any> = {};
        Object.keys(obj).forEach(el => fields.includes(el) ? newObj[el] = obj[el] : null);
        return newObj;
    }

    return  fields.forEach(field => obj[field] = undefined);
};