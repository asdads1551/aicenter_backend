import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async googleLogin(user: any) {
    if (!user) {
      return 'No user from google';
    }

    const payload = { email: user.email, sub: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async githubLogin(user: any) {
    if (!user) {
      return 'No user from github';
    }

    const payload = { email: user.email, sub: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
} 