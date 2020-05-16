import { applyDecorators, CanActivate, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { AuthRequiredGuard } from '../guards/auth-required.guard';
import { RestrictToGuard } from '../guards/restrict-to.guard';
import { ModelCtor } from 'sequelize-typescript';
import { IsOwnerGuard } from '../guards/is-owner.guard';
import { UserRoles } from '../models/user/user.enums';

type AuthOptions = {
    isOwner?: ModelCtor<any>,
    roles?: UserRoles[]
}

export const Auth = (options?: AuthOptions) => {

    const decorators = [
        ApiBearerAuth(),
        ApiForbiddenResponse({ description: 'Forbidden.' })
    ];

    const guards: CanActivate[] | Function[] = [AuthRequiredGuard];

    if (options?.roles?.length > 0) {
        decorators.push(SetMetadata('roles', options.roles));

        guards.push(RestrictToGuard);
    }

    if (options?.isOwner) {
        decorators.push(SetMetadata('model', options.isOwner));

        guards.push(IsOwnerGuard);
    }

    decorators.push(UseGuards(...guards));


    return applyDecorators(...decorators)
};