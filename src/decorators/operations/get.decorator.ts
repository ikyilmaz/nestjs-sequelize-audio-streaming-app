import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiParamOptions } from '@nestjs/swagger';
import { applyDecorators, Get } from '@nestjs/common';

export const GetOperation = (options?: { path?: string | string[], params?: ApiParamOptions[] | false }) => {
    const path = options?.path;
    const params = options?.params;

    const decorators: MethodDecorator[] = [
        ApiOkResponse({ description: 'Found.' }),
        ApiNotFoundResponse({ description: 'Not found.' }),
        ApiBadRequestResponse({ description: 'Validation failed.' }),
        Get(path ? path : '/:id'),
    ];

    if (!(params === false)) {
        if (params?.length > 0) decorators.push(...params.map(param => ApiParam(param)));
        else decorators.push(ApiParam({ name: 'id', type: 'UUID' }));
    }

    return applyDecorators(...decorators);
};