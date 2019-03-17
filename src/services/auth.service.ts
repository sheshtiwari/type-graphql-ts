import { sign, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { Service } from "typedi";
import { UsersService } from "./users.service";

@Service()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  comparePassword(authPassword: string, password: string) {
    return this.userService.comparePassword(authPassword, password);
  }

  createToken(id: number) {
    return sign({ id }, JWT_SECRET, { expiresIn: "7d" });
  }

  verifyToken(token: string) {
    return verify(token, JWT_SECRET) as { id: number };
  }
}
