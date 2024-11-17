import { Module } from '@nestjs/common';
import { UserToolLikeController } from './user-tool-like/user-tool-like.controller';
import { ToolLikeModule } from '../toolLikes/tool-like.module';
import { UserToolReviewController } from './user-tool-review/user-tool-review.controller';
import { ToolReviewModule } from '../toolReviews/tool-review.module';

@Module({
  imports: [ToolLikeModule, ToolReviewModule],
  controllers: [UserToolLikeController, UserToolReviewController],
  providers: [],
})
export class UserModule {}
