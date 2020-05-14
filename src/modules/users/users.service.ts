import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User from '../../models/user/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParamIdDto } from '../../helpers/common-dtos/param-id.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private $user: typeof User) {

    }

    getMany = () => {
        return this.$user.scope("public").findAll();
    };

    get = (id: string) => {
        return this.$user.scope("public").findByPk(id);
    };

    create = (createUserDto: CreateUserDto) => {
        return this.$user.create(createUserDto);
    };

    update = (id: string, updateUserDto: UpdateUserDto) => {
        return this.$user.update(updateUserDto, { where: { id } });
    };

    delete = (id: string) => {
        return this.$user.destroy({ where: { id } });
    };
}
