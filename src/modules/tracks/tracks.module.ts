import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { TracksRelatedModule } from './tracks-related/tracks-related.module';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../../models/user/user.model';
import Track from '../../models/track/track.model';

@Module({
    imports: [
        SequelizeModule.forFeature([User, Track]),
        TracksRelatedModule,
    ],
    controllers: [TracksController],
    providers: [TracksService],
})
export class TracksModule {

}
