import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ToolCommentDocument = HydratedDocument<ToolComment>;

@Schema({ timestamps: true, collection: 'toolComments' })
export class ToolComment {
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

  @Prop({
    isRequired: true,
  })
  comment: string;

  @Prop({
    default: 0,
  })
  likeCount: number;
}

export const ToolCommentSchema = SchemaFactory.createForClass(ToolComment);
ToolCommentSchema.index({ userId: 1, toolId: 1 }, { unique: false });
