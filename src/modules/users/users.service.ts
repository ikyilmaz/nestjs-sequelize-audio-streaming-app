import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User from '../../models/user/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserProfile from '../../models/user/user-profile/user-profile.model';
import { filterObject } from '../../helpers/utils/filter-object';
import { limitFields, paginate } from '../../helpers/utils/api-features';
import { queryObject } from '../../helpers/utils/query-object';
import { UserFields as uf } from '../../models/user/user.enums';
import { GetManyUserQueryDto } from './dto/user-query.dto';
import { GetOneQueryDto } from '../../helpers/common-dtos/common-query.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private $user: typeof User) {

    }

    getMany = (query: GetManyUserQueryDto) => {
        return this.$user.scope('public').findAll({
            ...paginate(query),
            attributes: limitFields(query.fields, {
                _enum: uf,
                defaults: [uf.id, uf.firstName, uf.lastName, uf.username],
                disallowedFields: [uf.password, uf.passwordChangedAt, uf.email, uf.role, uf.createdAt, uf.updatedAt],
            }),
            where: queryObject(query, [uf.firstName, uf.lastName, uf.username, uf.photo]),
        });
    };

    get = (query: GetOneQueryDto,id: string) => {
        return this.$user.scope('public').findByPk(id, {
            attributes: limitFields(query.fields, {
                _enum: uf,
                defaults: [uf.id, uf.firstName, uf.lastName, uf.username],
                disallowedFields: [uf.password, uf.passwordChangedAt, uf.email, uf.role, uf.createdAt, uf.updatedAt],
            }),
        });
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
