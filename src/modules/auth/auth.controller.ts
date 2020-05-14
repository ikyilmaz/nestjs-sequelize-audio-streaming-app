import {
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Body,
    Get,
    BadRequestException,
    Res,
    UnauthorizedException,
    Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from '@app/token';
import { Response } from 'express';
import User from 'src/models/user/user.model';
import * as moment from 'moment';
import * as bcrypt from 'bcryptjs';
import { catchAsync } from '../../helpers/utils/catch-async';
import { SignUpDto } from './dto/sign-up.dto';
import { filterObject } from '../../helpers/utils/filter-object';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly $authService: AuthService, private readonly $tokenService: TokenService) {}

    @Post('/sign-up')
    async signUp(@Body() body: SignUpDto, @Res() res: Response) {
        if (body.password != body.passwordConfirm) throw new BadRequestException("passwords don't match");

        const doc = await catchAsync(this.$authService.create(body));

        filterObject(doc, ['password', 'passwordChangedAt']);

        await this.createAndSendToken(doc, res);
    }

    @Post('/sign-in')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() body: SignInDto, @Res() res: Response) {
        if (!body.username && !body.email) throw new BadRequestException('you must specify either username or email');

        const doc = await catchAsync(this.$authService.get({ username: body.username, email: body.email }));

        if (!doc) throw new UnauthorizedException('email, username or password is not correct');

        if (!(await bcrypt.compare(body.password, doc.password)))
            throw new UnauthorizedException('email, username or password is not correct');

        await this.createAndSendToken(doc, res);
    }

    @Get('/sign-out')
    async signOut(@Res() res: Response) {
        res.cookie('jwt', 'signed-out', {
            httpOnly: true,
            expires: moment()
                .add(15, 'seconds')
                .toDate(),
        }).send();
    }

    @Patch('/update-password')
    async updatePassword() {}

    @Patch('/update-email')
    async updateEmail() {}

    @Patch('/update')
    async updateMe() {}

    @Get('/current-user')
    @HttpCode(HttpStatus.OK)
    async getCurrentUser() {}

    private async createAndSendToken(user: User, res: Response) {
        const token = await catchAsync(this.$tokenService.generateJWTToken(user.id));

        filterObject(user, ['password', 'passwordChangedAt']);

        res.cookie('jwt', token, {
            httpOnly: true,
            expires: moment()
                .add(3, 'months')
                .toDate(),
        });

        res.json({ status: 'success', token, data: user });
    }
}
