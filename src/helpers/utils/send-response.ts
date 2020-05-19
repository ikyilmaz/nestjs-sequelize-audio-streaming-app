import { NotFoundException } from '@nestjs/common';

/**
 * @description short hand for sending response
 * */
export const SendResponse = async (data: any) => {
    if (typeof data == 'string') data = JSON.parse(data);
    if (!data || (Array.isArray(data) && data.length == 0)) throw new NotFoundException();
    return { status: 'success', data };
};
