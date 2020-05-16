import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { applyDecorators, Get } from '@nestjs/common';

export const GetManyOperation = (path?: string | string[]) => {

    const decorators: MethodDecorator[] = [
        ApiOkResponse({ description: 'Found.' }),
        ApiNotFoundResponse({ description: 'Not found.' }),
        ApiBadRequestResponse({ description: 'Validation failed.' }),
        Get(path ? path : '/'),
    ];

    return applyDecorators(...decorators);
};