import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolLikeController } from './tool-like.controller';
import { ToolLikeService } from './tool-like.service';
import { ToolLike, ToolLikeSchema } from './tool-like.schema';
import { AuthModule } from '../auth/auth.module';
import { ToolModule } from '../tools/tool.module';

@Module({
  imports: [
    AuthModule,
    ToolModule,
    MongooseModule.forFeature([
      { name: ToolLike.name, schema: ToolLikeSchema },
    ]),
  ],
  controllers: [ToolLikeController],
  providers: [ToolLikeService],
  exports: [ToolLikeService],
})
export class ToolLikeModule {}
