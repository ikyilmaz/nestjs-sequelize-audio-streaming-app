import { Module } from '@nestjs/common';
import { UsersRelatedService } from './users-related.service';
import { UsersRelatedController } from './users-related.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../../../models/user/user.model';

@Module({
    imports: [
        SequelizeModule.forFeature([User])
    ],
    providers: [UsersRelatedService],
    controllers: [UsersRelatedController],
})
export class UsersRelatedModule {

}
