import { createHmac } from "crypto";
import { UserEntity } from "../entities";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class UsersService {
  @InjectRepository(UserEntity)
  private repository: Repository<UserEntity>;

  find() {
    return this.repository.find();
  }

  findOne(query: { login?: string; id?: number }) {
    return this.repository.findOne(query);
  }

  create({ login, password }) {
    return this.repository
      .create({
        passwordHash: this.createPassword(password),
        login
      })
      .save();
  }

  createPassword(password: string) {
    return createHmac("sha256", password).digest("hex");
  }

  comparePassword(authPassword: string, password: string) {
    return createHmac("sha256", authPassword).digest("hex") === password;
  }
}
