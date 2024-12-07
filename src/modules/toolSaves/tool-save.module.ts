import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolSaveController } from './tool-save.controller';
import { ToolSaveService } from './tool-save.service';
import { ToolSave, ToolSaveSchema } from './tool-save.schema';
import { AuthModule } from '../auth/auth.module';
import { ToolModule } from '../tools/tool.module';

@Module({
  imports: [
    AuthModule,
    ToolModule,
    MongooseModule.forFeature([
      { name: ToolSave.name, schema: ToolSaveSchema },
    ]),
  ],
  controllers: [ToolSaveController],
  providers: [ToolSaveService],
  exports: [ToolSaveService],
})
export class ToolSaveModule {}
