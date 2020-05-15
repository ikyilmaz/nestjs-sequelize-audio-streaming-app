import { Module } from '@nestjs/common';
import { TracksRelatedController } from './tracks-related.controller';
import { TracksRelatedService } from './tracks-related.service';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../../../models/user/user.model';
import Track from '../../../models/track/track.model';

@Module({
    imports: [
        SequelizeModule.forFeature([User, Track]),
    ],
    controllers: [TracksRelatedController],
    providers: [TracksRelatedService],
})
export class TracksRelatedModule {
}
