import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ToolReviewDocument = HydratedDocument<ToolReview>;

@Schema({ timestamps: true, collection: 'toolReviews' })
export class ToolReview {
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
    type: Number,
    isRequired: true,
  })
  rating: number;

  @Prop()
  comment: string;
}

export const ToolReviewSchema = SchemaFactory.createForClass(ToolReview);
ToolReviewSchema.index({ userId: 1, toolId: 1 }, { unique: true });
