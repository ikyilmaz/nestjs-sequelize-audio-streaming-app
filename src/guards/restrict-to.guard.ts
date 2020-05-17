import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CurrentUser } from '@app/current-user';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RestrictToGuard implements CanActivate {
    constructor(private $currentUserService: CurrentUser, private $reflector: Reflector) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.$reflector.get<string[]>('roles', context.getHandler());

        return roles.includes(this.$currentUserService.getUser.role);
    }
}
