import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Album from '../../models/album/album.model';
import { paginate } from '../../helpers/utils/api-features';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CurrentUser } from '@app/current-user';
import User from '../../models/user/user.model';
import Track from '../../models/track/track.model';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { queryObject } from '../../helpers/utils/query-object';
import { GetManyTrackQueryDto } from '../tracks/dto/track-query.dto';
import { AlbumFields as af } from '../../models/album/album.enums';
import { limitAlbumFields } from '../../helpers/field-limiters/album.field-limiters';
import { GetOneAlbumQueryDto } from './dto/album-query.dto';
import { limitPublicUserFields } from '../../helpers/field-limiters/user.field-limiters';
import { limitTrackFields } from '../../helpers/field-limiters/track.field-limiter';
import { Sequelize } from 'sequelize-typescript';
import { RedisService } from 'nestjs-redis';
import * as bluebird from 'bluebird';
import { GETTER_01, SETTER_01 } from '../../redis/redis.constants';
import { Redis } from 'ioredis';
import * as moment from 'moment';
import * as sharp from 'sharp';

@Injectable()
export class AlbumsService {
    redisMaster: Redis;
    redisSlave: Redis;

    constructor(
        @InjectModel(Album) private readonly $album: typeof Album,
        private readonly $currentUser: CurrentUser,
        private readonly $redisService: RedisService,
    ) {
        this.redisMaster = bluebird.promisifyAll(this.$redisService.getClient(SETTER_01));
        this.redisSlave = bluebird.promisifyAll(this.$redisService.getClient(GETTER_01));
    }

    async getMostLiked() {

        const cachedSource = await (this.redisSlave as any).getAsync('albums:most_liked');

        if (cachedSource) return cachedSource;

        const albums = await this.$album.findAll({
            attributes: {
                include: [
                    [
                        Sequelize.literal(
                            '(SELECT COUNT(*) FROM "AlbumLikes" WHERE "AlbumLikes"."albumId" = "Album"."id")',
                        ), 'likesCount',
                    ],
                ],
            },
            order: [
                [Sequelize.literal('"likesCount"'), 'DESC'],
            ],
        });

        await (this.redisMaster as any).setexAsync('albums:most_liked', 250, JSON.stringify(albums));

        return albums;
    }

    getMany(query: GetManyTrackQueryDto) {
        return this.$album.findAll({
            ...paginate(query),
            where: queryObject(query, [af.title, af.ownerId]),
            attributes: limitAlbumFields(query.fields),
        });
    }

    create(createAlbumDto: CreateAlbumDto) {
        return this.$album.create({
            title: createAlbumDto.title,
            photo: createAlbumDto.photo,
            ownerId: this.$currentUser.getUser.id,
        });
    }

    get(query: GetOneAlbumQueryDto, id: string) {
        return this.$album.findByPk(id, {
            attributes: limitAlbumFields(query.fields),
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: limitPublicUserFields(query.ownerFields),
                },
                {
                    model: User,
                    as: 'artists',
                    attributes: limitPublicUserFields(query.ownerFields),
                    through: { attributes: [] },
                },
                {
                    model: Track,
                    attributes: limitTrackFields(query.trackFields),
                },
            ],
        });
    }

    update(id: string, updateAlbumDto: UpdateAlbumDto) {
        return this.$album.update(updateAlbumDto, { where: { id } });
    }

    delete(id: string) {
        return this.$album.destroy({ where: { id } });
    }

    async updateAlbumPhoto(id: string, file: Pick<any, any>) {
        file.filename = `album-${this.$currentUser.getUser.id}-${moment().unix()}.jpeg`;

        await sharp(file.buffer as Buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`${__dirname}/../public/assets/img/album-images/${file.filename}`);

        return this.$album.update({ photo: file.filename }, { where: { id } });
    }
}
