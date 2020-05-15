import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { TracksRelatedModule } from './tracks-related/tracks-related.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  imports: [TracksRelatedModule]
})
export class TracksModule {}
