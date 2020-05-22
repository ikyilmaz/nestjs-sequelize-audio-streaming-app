import { Module } from '@nestjs/common';
import { TrackLikesService } from './track-likes.service';
import { TrackLikesController } from './track-likes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import Track from '../../../models/track/track.model';
import TrackLike from '../../../models/m2m/like/track-like/track-like.model';
import User from '../../../models/user/user.model';

@Module({
    imports: [
        SequelizeModule.forFeature([Track, TrackLike, User]),
    ],
    providers: [TrackLikesService],
    controllers: [TrackLikesController],
})
export class TrackLikesModule {
}
