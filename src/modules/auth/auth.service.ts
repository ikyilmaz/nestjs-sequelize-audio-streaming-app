import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import UserProfile from "../../models/user/user-profile/user-profile.model";
import User from "../../models/user/user.model";
import { SignUpDto } from "./dto/sign-up.dto";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private readonly $user: typeof User) {

  }

  create(body: SignUpDto): Promise<User> {
    return this.$user.create({ ...body, profile: {} }, { isNewRecord: true, include: [UserProfile] });
  }

  get(identifier: { username: string; email: string }): Promise<User> {
    let where: Partial<{ username: string; email: string }> = {};

    if (identifier.username) where.username = identifier.username;

    else if (identifier.email) where.email = identifier.email;

    return this.$user.scope("private").findOne({ where, attributes: { include: ["password"] } });
  }

  update(id: string, data) {
    return this.$user.update({ username: data.username, email: data.email }, { where: { id } });
  }

  delete(id: string) {
    return this.$user.destroy({ where: { id } });
  }
}