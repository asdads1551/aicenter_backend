import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolReviewController } from './tool-review.controller';
import { ToolReviewService } from './tool-review.service';
import { ToolReview, ToolReviewSchema } from './tool-review.schema';
import { AuthModule } from '../auth/auth.module';
import { ToolModule } from '../tools/tool.module';

@Module({
  imports: [
    AuthModule,
    ToolModule,
    MongooseModule.forFeature([
      { name: ToolReview.name, schema: ToolReviewSchema },
    ]),
  ],
  controllers: [ToolReviewController],
  providers: [ToolReviewService],
  exports: [ToolReviewService],
})
export class ToolReviewModule {}
