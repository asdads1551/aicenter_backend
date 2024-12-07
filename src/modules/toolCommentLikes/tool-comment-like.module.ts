import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolCommentLikeController } from './tool-comment-like.controller';
import { ToolCommentLikeService } from './tool-comment-like.service';
import {
  ToolCommentLike,
  ToolCommentLikeSchema,
} from './tool-comment-like.schema';
import { AuthModule } from '../auth/auth.module';
import { ToolCommentModule } from '../toolComments/tool-comment.module';

@Module({
  imports: [
    AuthModule,
    ToolCommentModule,
    MongooseModule.forFeature([
      { name: ToolCommentLike.name, schema: ToolCommentLikeSchema },
    ]),
  ],
  controllers: [ToolCommentLikeController],
  providers: [ToolCommentLikeService],
  exports: [ToolCommentLikeService],
})
export class ToolCommentLikeModule {}
