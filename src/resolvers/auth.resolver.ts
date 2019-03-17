import { UserEntity } from "../entities";
import { Context } from "../main";
import { AuthService, UsersService } from "../services";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from "type-graphql";
import { Service } from "typedi";

@ObjectType()
export class Token {
  @Field()
  token: string;
}

@Service()
@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Mutation(() => Token)
  async signIn(
    @Arg("login") login: string,
    @Arg("password") password: string
  ): Promise<Token | null> {
    const user = await this.userService.findOne({ login });

    if (!user) {
      return null;
    }

    if (!this.authService.comparePassword(password, user.passwordHash)) {
      return null;
    }

    return {
      token: this.authService.createToken(user.id)
    };
  }

  @Query(() => UserEntity, { nullable: true })
  authUser(@Ctx() { state: { user } }: Context) {
    return user;
  }
}
