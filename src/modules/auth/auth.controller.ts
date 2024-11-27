import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Redirect,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiHeader } from '@nestjs/swagger';
import { MockSigninDto } from './dto/mock-signin.dto';
import { UserService } from '../users/user.service';
import { get } from 'lodash';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('/google/redirect')
  @Redirect(`${process.env.FRONTEND_HOST}`, 302)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthenticated');
    }

    const token = await this.authService.signIn(req.user);
    return { url: `${process.env.FRONTEND_HOST}/signin?token=${token}` };
  }

  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  /** github user payload
   * {
      "id": "189592680",
      "displayName": null,
      "username": "AICenter7777",
      "profileUrl": "https://github.com/AICenter7777",
      "emails": [
        {
          "value": "foo@gmail.com"
        }
      ],
      "photos": [
        {
          "value": "https://avatars.githubusercontent.com/u/189592680?v=4"
        }
      ],
      "provider": "github",
      "_raw": "{\"login\":\"AICenter7777\",\"id\":189592680,\"node_id\":\"U_kgDOC0z0aA\",\"avatar_url\":\"https://avatars.githubusercontent.com/u/189592680?v=4\",\"gravatar_id\":\"\",\"url\":\"https://api.github.com/users/AICenter7777\",\"html_url\":\"https://github.com/AICenter7777\",\"followers_url\":\"https://api.github.com/users/AICenter7777/followers\",\"following_url\":\"https://api.github.com/users/AICenter7777/following{/other_user}\",\"gists_url\":\"https://api.github.com/users/AICenter7777/gists{/gist_id}\",\"starred_url\":\"https://api.github.com/users/AICenter7777/starred{/owner}{/repo}\",\"subscriptions_url\":\"https://api.github.com/users/AICenter7777/subscriptions\",\"organizations_url\":\"https://api.github.com/users/AICenter7777/orgs\",\"repos_url\":\"https://api.github.com/users/AICenter7777/repos\",\"events_url\":\"https://api.github.com/users/AICenter7777/events{/privacy}\",\"received_events_url\":\"https://api.github.com/users/AICenter7777/received_events\",\"type\":\"User\",\"user_view_type\":\"public\",\"site_admin\":false,\"name\":null,\"company\":null,\"blog\":\"\",\"location\":null,\"email\":null,\"hireable\":null,\"bio\":null,\"twitter_username\":null,\"notification_email\":null,\"public_repos\":0,\"public_gists\":0,\"followers\":0,\"following\":0,\"created_at\":\"2024-11-25T07:34:46Z\",\"updated_at\":\"2024-11-25T07:34:46Z\"}",
      "_json": {
        "login": "AICenter7777",
        "id": 189592680,
        "node_id": "U_kgDOC0z0aA",
        "avatar_url": "https://avatars.githubusercontent.com/u/189592680?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/AICenter7777",
        "html_url": "https://github.com/AICenter7777",
        "followers_url": "https://api.github.com/users/AICenter7777/followers",
        "following_url": "https://api.github.com/users/AICenter7777/following{/other_user}",
        "gists_url": "https://api.github.com/users/AICenter7777/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/AICenter7777/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/AICenter7777/subscriptions",
        "organizations_url": "https://api.github.com/users/AICenter7777/orgs",
        "repos_url": "https://api.github.com/users/AICenter7777/repos",
        "events_url": "https://api.github.com/users/AICenter7777/events{/privacy}",
        "received_events_url": "https://api.github.com/users/AICenter7777/received_events",
        "type": "User",
        "user_view_type": "public",
        "site_admin": false,
        "name": null,
        "company": null,
        "blog": "",
        "location": null,
        "email": "foo@gmail.com",,
        "hireable": null,
        "bio": null,
        "twitter_username": null,
        "notification_email": "foo@gmail.com",,
        "public_repos": 0,
        "public_gists": 0,
        "followers": 0,
        "following": 0,
        "created_at": "2024-11-25T07:34:46Z",
        "updated_at": "2024-11-25T07:34:46Z"
      }
    }
  */
  @Get('/github/redirect')
  @Get('/github/callback')
  @Redirect(`${process.env.FRONTEND_HOST}`, 302)
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthenticated');
    }
    const githubId = req.user?._json?.id;
    const createUserDto: CreateUserDto = {
      email: req.user?.emails?.[0]?.value || `${githubId}@fakegithub.com`,
      nickname: req.user?.displayName || req.user?.username || null,
      avatarUrl: req.user?.photos?.[0]?.value,
      isGithubUser: true,
      sourceData: {
        github: {
          profile: req.user._json,
        },
      },
    };

    const token = await this.authService.signIn(createUserDto);
    return { url: `${process.env.FRONTEND_HOST}/signin?token=${token}` };
  }

  @Post('/mock/login')
  @ApiHeader({
    name: 'x-api-key',
  })
  @UseGuards(AuthGuard('api-key'))
  async mockLogin(@Body() dto: MockSigninDto) {
    const user = await this.userService.findOneByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.authService.generateJwt({
      sub: get(user, '_id'),
      email: user.email,
    });
  }
}
