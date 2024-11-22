import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ToolFavDocument = HydratedDocument<ToolFav>;

@Schema({ timestamps: true, collection: 'toolFavs' })
export class ToolFav {
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

export const ToolFavSchema = SchemaFactory.createForClass(ToolFav);
ToolFavSchema.index({ userId: 1, toolId: 1 }, { unique: true });
