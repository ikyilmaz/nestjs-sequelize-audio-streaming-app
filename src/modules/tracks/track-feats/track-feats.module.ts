import { Module } from '@nestjs/common';
import { TrackFeatsService } from './track-feats.service';
import { TrackFeatsController } from './track-feats.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import Track from '../../../models/track/track.model';
import User from '../../../models/user/user.model';

@Module({
  imports: [
      SequelizeModule.forFeature([Track, User])
  ],
  providers: [TrackFeatsService],
  controllers: [TrackFeatsController]
})
export class TrackFeatsModule {}
