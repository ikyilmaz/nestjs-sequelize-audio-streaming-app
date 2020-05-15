import { Injectable } from '@nestjs/common';
import { PaginateQueryDto } from '../../helpers/common-dtos/paginate-query.dto';
import { InjectModel } from '@nestjs/sequelize';
import Track from '../../models/track/track.model';
import { paginate } from '../../helpers/utils/paginate';
import { CreateTrackDto } from './dto/create-track.dto';
import { CurrentUserService } from '@app/current-user';
import * as mp3Duration from 'mp3-duration';
import * as fs from 'fs';
import { promisify } from 'util';
import moment = require('moment');
import User from '../../models/user/user.model';
import Album from '../../models/album/album.model';

@Injectable()
export class TracksService {
    constructor(
        @InjectModel(Track) private $track: typeof Track,
        private $currentUser: CurrentUserService,
    ) {

    }

    getMany(query: PaginateQueryDto) {
        return this.$track.findAll({ ...paginate(query) });
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
}
