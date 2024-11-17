import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolFavController } from './tool-fav.controller';
import { ToolFavService } from './tool-fav.service';
import { ToolFav, ToolFavSchema } from './tool-fav.schema';
import { AuthModule } from '../auth/auth.module';
import { ToolModule } from '../tools/tool.module';

@Module({
  imports: [
    AuthModule,
    ToolModule,
    MongooseModule.forFeature([
      { name: ToolFav.name, schema: ToolFavSchema },
    ]),
  ],
  controllers: [ToolFavController],
  providers: [ToolFavService],
  exports: [ToolFavService],
})
export class ToolFavModule {}
