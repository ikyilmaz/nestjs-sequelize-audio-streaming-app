import {
    ApiBadRequestResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiParam,
    ApiParamOptions,
} from '@nestjs/swagger';
import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';

export const DeleteOperation = (...params: ApiParamOptions[]) => {
    const decorators: MethodDecorator[] = [
        ApiNoContentResponse({ description: 'Deleted.' }),
        ApiNotFoundResponse({ description: 'Not found.' }),
        ApiBadRequestResponse({ description: 'Validation failed.' }),
        HttpCode(HttpStatus.NO_CONTENT)
    ];

    if (params?.length > 0) decorators.push(...params.map(param => ApiParam(param)));
    else decorators.push(ApiParam({ name: 'id', type: 'UUID' }));

    return applyDecorators(...decorators);
};