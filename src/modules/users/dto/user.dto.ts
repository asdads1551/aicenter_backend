import { User } from '../user.schema';
import { UserBasicInfo } from './user-basic-info.dto';
import { UserMeInfo } from './user-me.dto';

export class UserDto {
  constructor(private readonly entity: User) {}

  getBasicInfo(): UserBasicInfo {
    return {
      _id: this.entity._id,
      nickname: this.entity.nickname,
      avatarUrl: this.entity.avatarUrl,
    };
  }

  getMyInfo(): UserMeInfo {
    return {
      _id: this.entity._id,
      nickname: this.entity.nickname,
      email: this.entity.email,
      avatarUrl: this.entity.avatarUrl,
      isGoogleUser: this.entity.isGoogleUser,
      isGithubUser: this.entity.isGithubUser,
    };
  }
}
