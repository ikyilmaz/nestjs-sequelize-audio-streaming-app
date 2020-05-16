import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { applyDecorators, Post } from '@nestjs/common';

export const CreateOperation = (path?: string | string[]) => applyDecorators(
    ApiCreatedResponse({ description: 'Created.' }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    Post(path ? path : '/'),
);
