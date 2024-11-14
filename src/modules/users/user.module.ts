import { Module } from '@nestjs/common';
import { UserToolLikesController } from './user-tool-like/user-tool-like.controller';
import { ToolLikeModule } from '../toolLikes/tool-like.module';

@Module({
  imports: [ToolLikeModule],
  controllers: [UserToolLikesController],
  providers: [],
})
export class UserModule {}
