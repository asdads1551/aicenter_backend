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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    CategoryModule,
    ToolModule,
    ToolLikeModule,
    ToolReviewModule,
    ToolFavModule,
    ToolCommentModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
