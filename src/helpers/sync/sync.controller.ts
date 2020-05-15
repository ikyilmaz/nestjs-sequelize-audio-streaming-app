import { Controller, Get, Query } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Controller('sync')
export class SyncController {
    constructor(@InjectConnection() private $sequelize: Sequelize) {
    }

    @Get('/')
    async sync(@Query({transform: (value) => Boolean(value)}) force: boolean) {
        await this.$sequelize.sync({force, logging: true})
    }
}
