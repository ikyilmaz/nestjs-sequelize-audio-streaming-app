import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiParamOptions } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const GetOperation = (...params: ApiParamOptions[]) => {

    const decorators: MethodDecorator[] = [
        ApiOkResponse({ description: 'Found.' }),
        ApiNotFoundResponse({ description: 'Not found.' }),
        ApiBadRequestResponse({ description: 'Validation failed.' }),
    ];

    if (params?.length > 0) decorators.push(...params.map(param => ApiParam(param)));
    else decorators.push(ApiParam({ name: 'id', type: 'UUID' }));

    return applyDecorators(...decorators);
};