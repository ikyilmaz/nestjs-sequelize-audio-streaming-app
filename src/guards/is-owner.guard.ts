import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { CurrentUser } from '@app/current-user';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ModelCtor } from 'sequelize-typescript';

@Injectable()
export class IsOwnerGuard implements CanActivate {
    constructor(private $currentUserService: CurrentUser, private $reflector: Reflector) {

    }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();

        const model = this.$reflector.get<ModelCtor>('model', context.getHandler());

        const doc = await model.findOne({ where: req.params });

        if (!doc) throw new NotFoundException();

        // @ts-ignore
        const isOwner = this.$currentUserService.getUser.id == doc.ownerId;
        const isAdmin = this.$currentUserService.getUser.role == 'admin';

        return (isOwner || isAdmin);
    }
}
