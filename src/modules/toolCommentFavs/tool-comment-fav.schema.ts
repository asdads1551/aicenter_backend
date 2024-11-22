import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ToolCommentFavDocument = HydratedDocument<ToolCommentFav>;

@Schema({ timestamps: true, collection: 'toolCommentFavs' })
export class ToolCommentFav {
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

export const ToolCommentFavSchema =
  SchemaFactory.createForClass(ToolCommentFav);
ToolCommentFavSchema.index({ userId: 1, toolId: 1 }, { unique: true });
