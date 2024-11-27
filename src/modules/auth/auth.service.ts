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

  async signIn(dto: CreateUserDto) {
    if (!dto) {
      throw new BadRequestException('Unauthenticated');
    }

    let userExists = await this.userService.findOneByEmail(dto.email);

    // Seems like the github user might not have an email from API payload
    if (!userExists && dto.isGithubUser) {
      userExists = await this.userService.findOneByGithubId(
        dto.sourceData?.github?.profile?.id,
      );
    }

    if (!userExists) {
      return this.registerUser(dto);
    }

    if (dto.isGoogleUser) {
      const updatedDto = {
        isGoogleUser: true,
        sourceData: {
          ...userExists?.sourceData,
          ...dto?.sourceData,
        },
      };
      await this.userService.updateOne(get(userExists, '_id'), updatedDto);
    }

    if (dto.isGithubUser) {
      const updatedDto = {
        isGithubUser: true,
        sourceData: {
          ...userExists?.sourceData,
          github: dto?.sourceData?.github,
        },
      };
      await this.userService.updateOne(get(userExists, '_id'), updatedDto);
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
