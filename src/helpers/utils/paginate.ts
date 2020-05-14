export const paginate = (query: Pick<any, any>, maxLimit: number = 50) => {
    const page = parseInt(query['page']) || 1;
    let limit = parseInt(query['limit']) || 25;

    if (limit > maxLimit) limit = maxLimit;

    const offset = page * limit - limit;

    return { offset, limit };
};
