import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.API_HOST}/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, photos } = profile;
    if (emails?.[0]?.value === undefined) {
      return done(null, false);
    }
    const user: CreateUserDto = {
      email: emails?.[0]?.value,
      nickname: displayName || null,
      avatarUrl: photos?.[0]?.value,
      isGoogleUser: true,
      sourceData: {
        google: {
          profile,
        },
      },
    };
    done(null, user);
  }
}
