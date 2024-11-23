import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async googleLogin(user: any) {
    if (!user) {
      return 'No user from google';
    }

    // 這裡可以加入將用戶保存到資料庫的邏輯

    const payload = { email: user.email, sub: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
} 