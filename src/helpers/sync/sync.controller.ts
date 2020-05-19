import { Controller, Get, Query } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { RedisService } from 'nestjs-redis';

@Controller('sync')
export class SyncController {
    constructor(
        @InjectConnection() private $sequelize: Sequelize,
        private readonly $redisService: RedisService,
    ) {
    }

    @Get('/db')
    async 'sync-db'(@Query({ transform: (value) => Boolean(value) }) force: boolean) {
        await this.$sequelize.sync({ force, logging: true });
    }

    @Get('/redis')
    async 'sync-redis'() {
        return { OK: await this.$redisService.getClient('setter-01').flushall() };
    }
}
