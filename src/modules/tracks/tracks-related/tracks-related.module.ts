import { Module } from '@nestjs/common';
import { TracksRelatedController } from './tracks-related.controller';
import { TracksRelatedService } from './tracks-related.service';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../../../models/user/user.model';
import Track from '../../../models/track/track.model';
import TrackLike from '../../../models/m2m/like/track-like/track-like.model';
import TrackComment from '../../../models/comment/track-comment/track-comment.model';

@Module({
    imports: [
        SequelizeModule.forFeature([
            User,
            Track,
            TrackLike,
            TrackComment,
        ]),
    ],
    controllers: [TracksRelatedController],
    providers: [TracksRelatedService],
})
export class TracksRelatedModule {
}
