import { Global, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';

@Global()
@Injectable()
export class TokenService {
    async generateJWTToken(id: string | number): Promise<string> {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    }

    async verifyJWTToken(token: string): Promise<{ id: string; iat: string }> {
        // @ts-ignore
        return (await promisify(jwt.verify)(token, process.env.JWT_SECRET)) as { id: string; iat: string };
    }
}
