import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolCommentFavController } from './tool-comment-fav.controller';
import { ToolCommentFavService } from './tool-comment-fav.service';
import {
  ToolCommentFav,
  ToolCommentFavSchema,
} from './tool-comment-fav.schema';
import { AuthModule } from '../auth/auth.module';
import { ToolCommentModule } from '../toolComments/tool-comment.module';

@Module({
  imports: [
    AuthModule,
    ToolCommentModule,
    MongooseModule.forFeature([
      { name: ToolCommentFav.name, schema: ToolCommentFavSchema },
    ]),
  ],
  controllers: [ToolCommentFavController],
  providers: [ToolCommentFavService],
  exports: [ToolCommentFavService],
})
export class ToolCommentFavModule {}
