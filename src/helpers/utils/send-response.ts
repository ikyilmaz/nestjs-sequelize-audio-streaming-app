import { NotFoundException } from '@nestjs/common';

/**
 * @description short hand for sending response
 * */
export const SendResponse = async (data: Promise<any> | any) => {
    let response = await data;
    if (!response || (Array.isArray(response) && response.length == 0)) throw new NotFoundException();
    if (typeof response == 'string') response = JSON.parse(response);
    return { status: 'success', data: response };
};
