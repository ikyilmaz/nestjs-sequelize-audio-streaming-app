import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import Track from '../../models/track/track.model';
import { limitFields, paginate } from '../../helpers/utils/api-features';
import { CreateTrackDto } from './dto/create-track.dto';
import { CurrentUser } from '@app/current-user';
import * as mp3Duration from 'mp3-duration';
import * as fs from 'fs';
import { promisify } from 'util';
import User from '../../models/user/user.model';
import Album from '../../models/album/album.model';
import { GetManyTrackQueryDto, GetOneTrackQueryDto } from './dto/track-query.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { queryObject } from '../../helpers/utils/query-object';
import { TrackFields } from '../../models/track/track.enums';
import { limitPublicUserFields } from '../../helpers/field-limiters/user.field-limiters';
import { limitAlbumFields } from '../../helpers/field-limiters/album.field-limiters';
import { limitTrackFields } from '../../helpers/field-limiters/track.field-limiter';
import { RedisService } from 'nestjs-redis';
import * as bluebird from 'bluebird';
import { GETTER_01, SETTER_01 } from '../../redis/redis.constants';
import { Redis } from 'ioredis';
import { Sequelize } from 'sequelize-typescript';
import moment = require('moment');

@Injectable()
export class TracksService {
    redisMaster: Redis;
    redisSlave: Redis;

    constructor(
        @InjectModel(Track) private readonly $track: typeof Track,
        @InjectConnection() private readonly $sequelize: Sequelize,
        private readonly $currentUser: CurrentUser,
        private readonly $redisService: RedisService,
    ) {
        this.redisMaster = bluebird.promisifyAll(this.$redisService.getClient(SETTER_01));
        this.redisSlave = bluebird.promisifyAll(this.$redisService.getClient(GETTER_01));
    }

    async getMostListened() {
        const cachedSource = await (this.redisSlave as any).getAsync('tracks:most_listened');

        if (cachedSource) return cachedSource;

        const tracks = await this.$track.findAll({ limit: 25, order: [['listenCount', 'DESC']] });

        await (this.redisMaster as any).setexAsync('tracks:most_listened', 250, JSON.stringify(tracks));

        return tracks;
    }

    async getMostLiked() {

        const cachedSource = await (this.redisSlave as any).getAsync('tracks:most_liked');

        if (cachedSource) return cachedSource;

        const tracks = await this.$track.findAll({
            attributes: {
                include: [
                    [
                        Sequelize.literal(
                            '(SELECT COUNT(*) FROM "TrackLikes" WHERE "TrackLikes"."trackId" = "Track"."id")',
                        ), 'likesCount',
                    ],
                ],
            },
            order: [
                [Sequelize.literal('"likesCount"'), 'DESC'],
            ],
        });

        await (this.redisMaster as any).setexAsync('tracks:most_liked', 250, JSON.stringify(tracks));

        return tracks;
    }

    getMany(query: GetManyTrackQueryDto) {
        return this.$track.findAll({
            ...paginate(query),
            attributes: limitFields(query.fields, {
                defaults: [TrackFields.id, TrackFields.title, TrackFields.albumId, TrackFields.ownerId],
                _enum: TrackFields,
            }),
            where: queryObject(query, ['title', 'ownerId']),
        });
    }

    async create(createTrackDto: CreateTrackDto, file: Pick<any, any>) {
        const duration = await promisify(mp3Duration)(file.buffer);
        file.filename = `track-${this.$currentUser.getUser.id}-${moment().unix()}`;

        fs.writeFile(`${__dirname}/../public/assets/audio/tracks/${file.filename}.mp3`, file.buffer, (err) => err);

        return this.$track.create({
            title: createTrackDto.title,
            albumId: createTrackDto.albumId,
            ownerId: this.$currentUser.getUser.id,
            duration: parseInt(duration),
            track: file.filename,
        });
    }

    get(id: string, query: GetOneTrackQueryDto) {
        return this.$track.findByPk(id, {
            attributes: limitTrackFields(query.fields),
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: limitPublicUserFields(query.ownerFields),
                },
                {
                    model: User,
                    as: 'artists',
                    attributes: limitPublicUserFields(query.artistFields),
                    through: { attributes: [] },
                },
                {
                    model: Album,
                    attributes: limitAlbumFields(query.albumFields),
                },
            ],
        });
    }

    update(id: string, updateTrackDto: UpdateTrackDto) {
        return this.$track.update({ title: updateTrackDto.title }, { where: { id }, returning: false });
    }

    delete(id: string) {
        return this.$track.destroy({ where: { id } });
    }
}
