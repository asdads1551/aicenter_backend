import { Module } from '@nestjs/common';
import { ToolLikeModule } from '../toolLikes/tool-like.module';
import { ToolReviewModule } from '../toolReviews/tool-review.module';
import { ToolFavModule } from '../toolFavs/tool-fav.module';
import { ToolCommentModule } from '../toolComments/tool-comment.module';
import { ToolCommentFavModule } from '../toolCommentFavs/tool-comment-fav.module';
import { UserToolLikeController } from './user-tool-like/user-tool-like.controller';
import { UserToolReviewController } from './user-tool-review/user-tool-review.controller';
import { UserToolFavController } from './user-tool-fav/user-tool-fav.controller';
import { UserToolCommentController } from './user-tool-comment/user-tool-comment.controller';
import { UserToolCommentFavController } from './user-tool-comment-fav/user-tool-comment-fav.controller';

@Module({
  imports: [
    ToolLikeModule,
    ToolReviewModule,
    ToolFavModule,
    ToolCommentModule,
    ToolCommentFavModule,
  ],
  controllers: [
    UserToolLikeController,
    UserToolReviewController,
    UserToolFavController,
    UserToolCommentController,
    UserToolCommentFavController,
  ],
  providers: [],
})
export class UserControllerModule {}
