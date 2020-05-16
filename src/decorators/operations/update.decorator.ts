import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiParamOptions } from '@nestjs/swagger';
import { applyDecorators, Patch } from '@nestjs/common';

export const UpdateOperation = (path?: string | string[], params?: ApiParamOptions[]) => {

    const decorators: MethodDecorator[] = [
        ApiOkResponse({ description: 'Updated.' }),
        ApiNotFoundResponse({ description: 'Not found.' }),
        ApiBadRequestResponse({ description: 'Validation failed.' }),
        Patch(path ? path : '/:id'),
    ];

    if (params?.length > 0) decorators.push(...params.map(param => ApiParam(param)));
    else decorators.push(ApiParam({ name: 'id', type: 'UUID' }));

    return applyDecorators(...decorators);
};