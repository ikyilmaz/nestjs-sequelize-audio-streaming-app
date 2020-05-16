import { Module } from '@nestjs/common';
import { UsersRelatedService } from './users-related.service';
import { UsersRelatedController } from './users-related.controller';

@Module({
  providers: [UsersRelatedService],
  controllers: [UsersRelatedController]
})
export class UsersRelatedModule {}
