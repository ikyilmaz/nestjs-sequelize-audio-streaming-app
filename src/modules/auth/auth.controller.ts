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
    Patch, UseGuards, InternalServerErrorException,
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
import {
    ApiBadRequestResponse, ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthRequiredGuard } from '../../guards/auth-required.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly $authService: AuthService, private readonly $tokenService: TokenService) {

    }

    /**
     *  @description Sign up path, creates a user and returns it
     *  @statusCodes 200, 400 */
    @ApiOperation({ summary: 'SIGN UP' })
    @ApiCreatedResponse({ description: 'User created.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @Post('/sign-up')
    async signUp(@Body() body: SignUpDto, @Res() res: Response) {
        if (body.password != body.passwordConfirm) throw new BadRequestException('passwords don\'t match');

        await this.createAndSendToken(await catchAsync(this.$authService.create(body)), res);
    }

    /**
     *  @description Sign in path, finds the user with the given credentials and returns it
     *  @statusCodes 200, 401, 400 */
    @ApiOperation({ summary: 'SIGN IN' })
    @ApiOkResponse({ description: 'Signed in.' })
    @ApiUnauthorizedResponse({ description: 'Incorrect credentials.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
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

    /**
     *  @description Sign out path, removes the jwt from the cookies
     *  @statusCodes 200 */
    @ApiOperation({ summary: 'SIGN OUT' })
    @ApiOkResponse({ description: 'Signed out.' })
    @Get('/sign-out')
    async signOut(@Res() res: Response) {
        res.cookie('jwt', 'signed-out', { httpOnly: true, expires: moment().add(15, 'seconds').toDate() }).send();
    }

    /**
     *  @description Updates user's password
     *  @permissions authenticated users
     *  @statusCodes 200, 401, 400 */
    @ApiOperation({ summary: 'UPDATE PASSWORD' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Password updated.' })
    @ApiUnauthorizedResponse({ description: 'Auth required.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @UseGuards(AuthRequiredGuard)
    @Patch('/update-password')
    async updatePassword() {
        throw new InternalServerErrorException()
    }

    /**
     *  @description Updates user's email, sends verification email
     *  @permissions authenticated users
     *  @statusCodes 200, 401, 400 */
    @ApiOperation({ summary: 'UPDATE EMAIL' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Verification email sent.' })
    @ApiUnauthorizedResponse({ description: 'Auth required.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @UseGuards(AuthRequiredGuard)
    @Patch('/update-email')
    async updateEmail() {
        throw new InternalServerErrorException()
    }

    /**
     *  @description Updates user's some properties
     *  @permissions authenticated users
     *  @statusCodes 200, 401, 400 */
    @ApiOperation({ summary: 'UPDATE USER' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'User updated.' })
    @ApiUnauthorizedResponse({ description: 'Auth required.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    @UseGuards(AuthRequiredGuard)
    @Patch('/update')
    async updateMe() {
        throw new InternalServerErrorException()
    }

    /**
     *  @description Returns the current user if it exists, if not returns null
     *  @permissions authenticated users
     *  @statusCodes 200 */
    @ApiOperation({ summary: 'GET CURRENT USER' })
    @ApiOkResponse({ description: 'Current user found or not.' })
    @Get('/current-user')
    async getCurrentUser() {
        throw new InternalServerErrorException()
    }

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
