import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User from '../../models/user/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserProfile from '../../models/user/user-profile/user-profile.model';
import { filterObject } from '../../helpers/utils/filter-object';
import { paginate } from '../../helpers/utils/paginate';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private $user: typeof User) {

    }

    getMany = (query: Pick<any, any>) => {
        return this.$user.scope('public').findAll({...paginate(query)});
    };

    get = (id: string) => {
        return this.$user.scope('public').findByPk(id);
    };

    create = async (createUserDto: CreateUserDto) => {
        const user = await this.$user.create({ ...createUserDto, profile: {} }, { include: [UserProfile] });
        filterObject(user, ['password', 'email']);
        return user;
    };

    update = async (id: string, updateUserDto: UpdateUserDto) => {
        await this.$user.update(updateUserDto, { where: { id } });
    };

    delete = (id: string) => {
        return this.$user.destroy({ where: { id } });
    };
}
