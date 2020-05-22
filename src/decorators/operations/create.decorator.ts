import { ApiBadRequestResponse, ApiCreatedResponse, ApiParam, ApiParamOptions } from '@nestjs/swagger';
import { applyDecorators, Post } from '@nestjs/common';

export const CreateOperation = (path?: string | string[], params?: ApiParamOptions[]) => {

    const decorators = [
        ApiCreatedResponse({ description: 'Created.' }),
        ApiBadRequestResponse({ description: 'Validation failed.' }),
        Post(path ? path : '/'),
    ];

    if (params?.length > 0) decorators.push(...params?.map(param => ApiParam(param)));
    else if (path?.includes(':id')) decorators.push(ApiParam({ name: 'id', type: 'UUID' }));

    return applyDecorators(...decorators);
};
