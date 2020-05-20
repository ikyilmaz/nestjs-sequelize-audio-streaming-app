import { Controller, Get, Query } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { RedisService } from 'nestjs-redis';
import User from '../../models/user/user.model';
import UserProfile from '../../models/user-profile/user-profile.model';
import Album from '../../models/album/album.model';
import Track from '../../models/track/track.model';
import TrackLike from '../../models/m2m/like/track-like/track-like.model';

@Controller('sync')
export class SyncController {
    constructor(
        @InjectConnection() private $sequelize: Sequelize,
        @InjectModel(User) private readonly $user: typeof User,
        @InjectModel(UserProfile) private readonly $userProfile: typeof UserProfile,
        @InjectModel(Album) private readonly $album: typeof Album,
        @InjectModel(Track) private readonly $track: typeof Track,
        @InjectModel(TrackLike) private readonly $trackLike: typeof TrackLike,
        private readonly $redisService: RedisService,
    ) {
    }

    @Get('/db')
    async 'sync-db'(@Query({ transform: (value) => Boolean(value) }) force: boolean) {
        await this.$sequelize.sync();
        const [redCat, whiteCat, purpleCat] = await this.$user.bulkCreate([
            {
                firstName: 'Red',
                lastName: 'Cat',
                username: 'red',
                email: 'red@example.com',
                password: '87654321',
            },
            {
                firstName: 'White',
                lastName: 'Cat',
                username: 'white',
                email: 'white@example.com',
                password: '87654321',
            },
            {
                firstName: 'Purple',
                lastName: 'Cat',
                username: 'purple',
                email: 'purple@example.com',
                password: '87654321',
            },
        ]);

        const [redCatAlbum, whiteCatAlbum] = await this.$album.bulkCreate([
            { title: 'My Red Album', ownerId: redCat.id },
            { title: 'My White Album', ownerId: whiteCat.id },
        ]);

        const [fearless, nope] = await this.$track.bulkCreate([
            { title: 'Fearless', ownerId: redCat.id, track: 'fearless', duration: 100, albumId: redCatAlbum.id },
            {
                title: 'The Bus Stop',
                ownerId: redCat.id,
                track: 'the-bus-stop',
                duration: 100,
                albumId: redCatAlbum.id,
            },
            { title: 'Nope', ownerId: whiteCat.id, track: 'nope', duration: 100, albumId: whiteCatAlbum.id },
            {
                title: 'Do Not Know',
                ownerId: whiteCat.id,
                track: 'do-not-know',
                duration: 100,
                albumId: whiteCatAlbum.id,
            },
        ]);

        await this.$trackLike.bulkCreate([
            { trackId: fearless.id, ownerId: purpleCat.id },
            { trackId: fearless.id, ownerId: whiteCat.id },
            { trackId: nope.id, ownerId: redCat.id },
        ]);
    }

    @Get('/redis')
    async 'sync-redis'() {
        return { OK: await this.$redisService.getClient('setter-01').flushall() };
    }
}
