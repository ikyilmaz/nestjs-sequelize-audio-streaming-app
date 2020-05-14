import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import Album from '../../models/album/album.model';
import { paginate } from '../../helpers/utils/paginate';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CurrentUserService } from '@app/current-user';
import UserAlbum from '../../models/m2m/useralbum.model';
import { Sequelize } from 'sequelize-typescript';
import * as moment from "moment";
import * as sharp from "sharp"

@Injectable()
export class AlbumsService {

    constructor(
        @InjectModel(Album) private $album: typeof Album,
        @InjectModel(UserAlbum) private $userAlbum: typeof UserAlbum,
        @InjectConnection() private $sequelize: Sequelize,
        private $currentUser: CurrentUserService,
    ) {
    }

    getMany(query: Pick<any, any>) {
        return this.$album.findAll({ ...paginate(query), attributes: ['id', 'title', 'photo', 'ownerId'] });
    }

    async create(createAlbumDto: CreateAlbumDto, file: Pick<any, any>) {
        if (file) {
            file.filename = `album-${this.$currentUser.getUser.id}-${moment().unix()}.jpeg`;

            createAlbumDto.photo = file.filename;

            await sharp(file.buffer as Buffer)
                .resize(500, 500)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`${__dirname}/../public/assets/img/album-images/${file.filename}`);
        }

        return this.$album.create({
            title: createAlbumDto.title,
            photo: createAlbumDto.photo,
            ownerId: this.$currentUser.getUser.id,
        });
    }
}
