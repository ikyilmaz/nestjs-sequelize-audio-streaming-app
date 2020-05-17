import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User from '../../models/user/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserProfile from '../../models/user-profile/user-profile.model';
import { filterObject } from '../../helpers/utils/filter-object';
import { paginate } from '../../helpers/utils/api-features';
import { queryObject } from '../../helpers/utils/query-object';
import { UserFields as uf } from '../../models/user/user.enums';
import { GetManyUserQueryDto } from './dto/user-query.dto';
import { GetOneQueryDto } from '../../helpers/common-dtos/common-query.dto';
import { limitPublicUserFields } from '../../helpers/field-limiters/user.field-limiters';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private $user: typeof User) {

    }

    getMany = (query: GetManyUserQueryDto) => {
        return this.$user.scope('public').findAll({
            ...paginate(query),
            attributes: limitPublicUserFields(query.fields),
            where: queryObject(query, [uf.firstName, uf.lastName, uf.username, uf.photo]),
        });
    };

    get = (query: GetOneQueryDto, id: string) => {
        return this.$user.scope('public').findByPk(id, {
            attributes: limitPublicUserFields(query.fields),
        });
    };

    create = async (createUserDto: CreateUserDto) => {
        const user = await this.$user.create({ ...createUserDto, profile: {} }, { include: [UserProfile] });
        return filterObject(user, ['password', 'email']);
    };

    update = async (id: string, updateUserDto: UpdateUserDto) => this.$user.update(updateUserDto, { where: { id } });


    delete = (id: string) => this.$user.destroy({ where: { id } });

}
