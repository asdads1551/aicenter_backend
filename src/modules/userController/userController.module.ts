import { Module } from '@nestjs/common';
import { ToolLikeModule } from '../toolLikes/tool-like.module';
import { ToolReviewModule } from '../toolReviews/tool-review.module';
import { ToolSaveModule } from '../toolSaves/tool-save.module';
import { ToolCommentModule } from '../toolComments/tool-comment.module';
import { ToolCommentLikeModule } from '../toolCommentLikes/tool-comment-like.module';
import { UserToolLikeController } from './user-tool-like/user-tool-like.controller';
import { UserToolReviewController } from './user-tool-review/user-tool-review.controller';
import { UserToolSaveController } from './user-tool-save/user-tool-save.controller';
import { UserToolCommentController } from './user-tool-comment/user-tool-comment.controller';
import { UserToolCommentLikeController } from './user-tool-comment-like/user-tool-comment-like.controller';

@Module({
  imports: [
    ToolLikeModule,
    ToolReviewModule,
    ToolSaveModule,
    ToolCommentModule,
    ToolCommentLikeModule,
  ],
  controllers: [
    UserToolLikeController,
    UserToolReviewController,
    UserToolSaveController,
    UserToolCommentController,
    UserToolCommentLikeController,
  ],
  providers: [],
})
export class UserControllerModule {}
