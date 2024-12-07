import { Module } from '@nestjs/common';
import { ToolLikeModule } from '../toolLikes/tool-like.module';
import { ToolReviewModule } from '../toolReviews/tool-review.module';
import { ToolSaveModule } from '../toolSaves/tool-save.module';
import { ToolCommentModule } from '../toolComments/tool-comment.module';
import { ToolCommentFavModule } from '../toolCommentFavs/tool-comment-fav.module';
import { UserToolLikeController } from './user-tool-like/user-tool-like.controller';
import { UserToolReviewController } from './user-tool-review/user-tool-review.controller';
import { UserToolSaveController } from './user-tool-save/user-tool-save.controller';
import { UserToolCommentController } from './user-tool-comment/user-tool-comment.controller';
import { UserToolCommentFavController } from './user-tool-comment-fav/user-tool-comment-fav.controller';

@Module({
  imports: [
    ToolLikeModule,
    ToolReviewModule,
    ToolSaveModule,
    ToolCommentModule,
    ToolCommentFavModule,
  ],
  controllers: [
    UserToolLikeController,
    UserToolReviewController,
    UserToolSaveController,
    UserToolCommentController,
    UserToolCommentFavController,
  ],
  providers: [],
})
export class UserControllerModule {}
