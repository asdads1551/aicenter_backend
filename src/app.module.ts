import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ToolModule } from './modules/tools/tool.module';
import { CategoryModule } from './modules/categories/category.module';
import { ToolLikeModule } from './modules/toolLikes/tool-like.module';
import { UserModule } from './modules/users/user.module';
import { ToolReviewModule } from './modules/toolReviews/tool-review.module';
import { ToolFavModule } from './modules/toolFavs/tool-fav.module';
import { ToolCommentModule } from './modules/toolComments/tool-comment.module';
import { ToolCommentFavModule } from './modules/toolCommentFavs/tool-comment-fav.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    CategoryModule,
    ToolModule,
    ToolLikeModule,
    ToolReviewModule,
    ToolFavModule,
    ToolCommentModule,
    ToolCommentFavModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
