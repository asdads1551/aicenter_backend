import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ToolCommentLikeDocument = HydratedDocument<ToolCommentLike>;

@Schema({ timestamps: true, collection: 'toolCommentLikes' })
export class ToolCommentLike {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'toolComments',
    isRequired: true,
    index: true,
  })
  toolCommentId: string;
}

export const ToolCommentLikeSchema =
  SchemaFactory.createForClass(ToolCommentLike);
ToolCommentLikeSchema.index({ userId: 1, toolId: 1 }, { unique: true });
