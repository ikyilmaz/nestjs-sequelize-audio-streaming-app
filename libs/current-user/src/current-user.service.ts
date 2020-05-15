import { Injectable, Scope } from '@nestjs/common';
import User from '../../../src/models/user/user.model';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
    private _user: User;

    set setUser(user: User) {
        this._user = user;
    }

    get getUser() {
        return this._user;
    }
}
