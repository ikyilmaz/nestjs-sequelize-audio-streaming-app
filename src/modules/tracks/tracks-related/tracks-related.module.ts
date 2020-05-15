import { Module } from '@nestjs/common';
import { TracksRelatedController } from './tracks-related.controller';
import { TracksRelatedService } from './tracks-related.service';

@Module({
  controllers: [TracksRelatedController],
  providers: [TracksRelatedService]
})
export class TracksRelatedModule {}
