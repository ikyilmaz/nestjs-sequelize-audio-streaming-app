import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Track from '../../models/track/track.model';
import { limitFields, paginate } from '../../helpers/utils/api-features';
import { CreateTrackDto } from './dto/create-track.dto';
import { CurrentUserService } from '@app/current-user';
import * as mp3Duration from 'mp3-duration';
import * as fs from 'fs';
import { promisify } from 'util';
import User from '../../models/user/user.model';
import Album from '../../models/album/album.model';
import { GetManyTrackQueryDto } from './dto/get-many-track-query.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { queryObject } from '../../helpers/utils/query-object';
import { TrackFields } from '../../models/track/track.enums';
import moment = require('moment');

@Injectable()
export class TracksService {
    constructor(
        @InjectModel(Track) private $track: typeof Track,
        private $currentUser: CurrentUserService,
    ) {

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
            duration,
            track: file.filename,
        });
    }

    get(id: string) {
        return this.$track.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'username'],
                },
                {
                    model: User,
                    as: 'artists',
                    attributes: ['id', 'firstName', 'lastName', 'username'],
                    through: { attributes: [] },
                },
                {
                    model: Album,
                    attributes: ['id', 'title', 'ownerId'],
                },
            ],
        });
    }

    update(id: string, updateTrackDto: UpdateTrackDto) {
        return this.$track.update({ title: updateTrackDto.title }, { where: { id } });
    }

    delete(id: string) {
        return this.$track.destroy({ where: { id } });
    }
}
