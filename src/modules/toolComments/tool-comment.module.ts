import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolCommentController } from './tool-comment.controller';
import { ToolCommentService } from './tool-comment.service';
import { ToolComment, ToolCommentSchema } from './tool-comment.schema';
import { AuthModule } from '../auth/auth.module';
import { ToolModule } from '../tools/tool.module';

@Module({
  imports: [
    AuthModule,
    ToolModule,
    MongooseModule.forFeature([
      { name: ToolComment.name, schema: ToolCommentSchema },
    ]),
  ],
  controllers: [ToolCommentController],
  providers: [ToolCommentService],
  exports: [ToolCommentService],
})
export class ToolCommentModule {}
