import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ToolModule } from './modules/tools/tool.module';
import { CategoryModule } from './modules/categories/category.module';
import { ToolLikeModule } from './modules/toolLikes/tool-like.module';
import { UserControllerModule } from './modules/userController/userController.module';
import { ToolReviewModule } from './modules/toolReviews/tool-review.module';
import { ToolSaveModule } from './modules/toolSaves/tool-save.module';
import { ToolCommentModule } from './modules/toolComments/tool-comment.module';
import { ToolCommentLikeModule } from './modules/toolCommentLikes/tool-comment-like.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    AuthModule,
    CategoryModule,
    ToolModule,
    ToolLikeModule,
    ToolReviewModule,
    ToolSaveModule,
    ToolCommentModule,
    ToolCommentLikeModule,
    UserControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
