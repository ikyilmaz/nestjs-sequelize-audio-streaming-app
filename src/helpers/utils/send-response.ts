import { NotFoundException } from '@nestjs/common';

/**
 * @description short hand for sending response
 * */
export const SendResponse = (data: any) => {
    if (!data || (Array.isArray(data) && data.length == 0)) throw new NotFoundException();
    if (typeof data == 'string') data = JSON.parse(data);
    return { status: 'success', data };
};
