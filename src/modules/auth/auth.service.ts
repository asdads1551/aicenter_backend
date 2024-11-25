import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateFromEmail } from 'unique-username-generator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserService } from '../users/user.service';
import { isNil, get } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async signIn(user: CreateUserDto) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.userService.findOneByEmail(user.email);

    if (!userExists) {
      return this.registerUser(user);
    }

    if (!userExists.isGoogleUser && user.isGoogleUser) {
      userExists.isGoogleUser = true;
      this.userService.updateOne(get(userExists, '_id'), {
        ...userExists,
        isGoogleUser: true,
        sourceData: {
          ...userExists?.sourceData,
          google: user?.sourceData?.google,
        },
      });
    }

    return this.generateJwt({
      sub: get(userExists, '_id'),
      email: userExists.email,
    });
  }

  private async registerUser(user: CreateUserDto) {
    try {
      const newUser = await this.userService.create({
        ...user,
        ...(isNil(user.nickname)
          ? { nickname: generateFromEmail(user.email, 5) }
          : {}),
      });

      return this.generateJwt({
        sub: get(newUser, '_id'),
        email: newUser.email,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
