import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ToolLikeDocument = HydratedDocument<ToolLike>;

@Schema({ timestamps: true, collection: 'toolLikes' })
export class ToolLike {
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

export const ToolLikeSchema = SchemaFactory.createForClass(ToolLike);
ToolLikeSchema.index({ userId: 1, toolId: 1 }, { unique: true });
