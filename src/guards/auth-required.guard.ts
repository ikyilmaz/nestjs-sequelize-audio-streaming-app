import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from '@app/current-user';
import { InjectModel } from '@nestjs/sequelize';
import User from '../models/user/user.model';
import { catchAsync } from '../helpers/utils/catch-async';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import * as chalk from 'chalk';

@Injectable()
export class AuthRequiredGuard implements CanActivate {
    constructor(private $currentUserService: CurrentUser, @InjectModel(User) private $user: typeof User) {
    }

    async canActivate(context: ExecutionContext) {
        console.log(chalk.blueBright('--> AuthRequired START'));

        const req = context.switchToHttp().getRequest<Request>();
        this.$user.findByPk();

        let token: string;

        const isAuthHeaderAndIsStatsWithBearer = req.headers.authorization && req.headers.authorization.startsWith('Bearer ');
        const cookiesHaveJwt = req.cookies && req.cookies.jwt;

        if (isAuthHeaderAndIsStatsWithBearer) token = req.headers.authorization.split(' ')[1];
        else if (cookiesHaveJwt) token = req.cookies.jwt;

        if (!token) return false;

        //@ts-ignore
        const decoded = await catchAsync(promisify(jwt.verify)(token, process.env.JWT_SECRET) as Promise<{ id: string; iat: string }>);

        if (!decoded.id) return false;

        const user = await this.$user.findByPk(decoded.id, {
            attributes: { include: ['passwordChangedAt'] },
        });

        if (!user) return false;

        if (user.passwordChangedAt) {
            const changedTimestamp = parseInt((user.passwordChangedAt.getTime() / 1000).toString(), 10);

            if (+decoded.iat < changedTimestamp) return false;
        }

        this.$currentUserService.setUser = user;

        console.log(chalk.blueBright('--> AuthRequired END'));

        return true;
    }
}
