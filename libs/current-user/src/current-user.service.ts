import { Injectable, Scope } from '@nestjs/common';
import User from '../../../src/models/user/user.model';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
    user: User;

    set setUser(user: User) {
        this.user = user;
    }

    get getUser() {
        return this.user;
    }
}
