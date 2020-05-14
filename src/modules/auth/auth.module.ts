import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../../models/user/user.model';
import { TokenModule } from '@app/token';

@Module({
    imports: [SequelizeModule.forFeature([User]), TokenModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
