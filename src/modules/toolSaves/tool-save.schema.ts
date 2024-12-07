import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ToolSaveDocument = HydratedDocument<ToolSave>;

@Schema({ timestamps: true, collection: 'toolSaves' })
export class ToolSave {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    isRequired: true,
  })
  userId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tools',
    isRequired: true,
    index: true,
  })
  toolId: string;
}

export const ToolSaveSchema = SchemaFactory.createForClass(ToolSave);
ToolSaveSchema.index({ userId: 1, toolId: 1 }, { unique: true });
