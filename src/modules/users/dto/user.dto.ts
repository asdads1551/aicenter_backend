import { User } from '../user.schema';
import { UserBasicInfo } from './user-basic-info.dto';

export class UserDto {
  constructor(private readonly entity: User) {}

  getBasicInfo(): UserBasicInfo {
    return {
      _id: this.entity._id,
      nickname: this.entity.nickname,
      avatarUrl: this.entity.avatarUrl,
    };
  }
}
