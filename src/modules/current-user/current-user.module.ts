import { Module } from '@nestjs/common';
import { CurrentUserService } from './current-user.service';
import { CurrentUserController } from './current-user.controller';

@Module({
  providers: [CurrentUserService],
  controllers: [CurrentUserController]
})
export class CurrentUserModule {}
