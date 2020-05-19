import { RedisModuleOptions } from 'nestjs-redis';

export const redisModuleOptions: RedisModuleOptions[] = [
    {
        name: 'setter-01',
        role: 'master',
    },
    {
        name: 'getter-01',
        role: 'slave',
    },
    {
        name: 'getter-02',
        role: 'slave',
    },
];