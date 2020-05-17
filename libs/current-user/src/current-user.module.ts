import { Global, Module } from '@nestjs/common';
import { CurrentUser } from './current-user.service';

@Global()
@Module({
    providers: [CurrentUser],
    exports: [CurrentUser],
})
export class CurrentUserModule {}
