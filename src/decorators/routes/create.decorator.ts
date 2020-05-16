import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const CreateOneOperation = () => applyDecorators(
    ApiCreatedResponse({ description: 'Created.' }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
);
