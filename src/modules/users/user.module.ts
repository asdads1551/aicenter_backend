import { Module } from '@nestjs/common';
import { UserToolLikeController } from './user-tool-like/user-tool-like.controller';
import { ToolLikeModule } from '../toolLikes/tool-like.module';
import { UserToolReviewController } from './user-tool-review/user-tool-review.controller';
import { ToolReviewModule } from '../toolReviews/tool-review.module';
import { ToolFavModule } from '../toolFavs/tool-fav.module';
import { UserToolFavController } from './user-tool-fav/user-tool-fav.controller';

@Module({
  imports: [ToolLikeModule, ToolReviewModule, ToolFavModule],
  controllers: [
    UserToolLikeController,
    UserToolReviewController,
    UserToolFavController,
  ],
  providers: [],
})
export class UserModule {}
