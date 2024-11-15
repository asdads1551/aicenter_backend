import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ToolDocument = HydratedDocument<Tool>;

@Schema({ timestamps: true })
export class Tool {
  @Prop({
    isRequired: true,
  })
  title: string;

  @Prop({
    isRequired: true,
  })
  imageUrl: string;

  @Prop({
    isRequired: true,
  })
  overview: string;

  @Prop({
    isRequired: true,
  })
  content: string;

  @Prop()
  url: string;

  @Prop({
    isRequired: true,
  })
  categoryIds: number[];

  @Prop({
    isRequired: true,
  })
  mainCategoryId: number;

  @Prop({
    default: false,
  })
  isAd: boolean;

  @Prop({
    default: 0,
  })
  @Prop()
  commentCount: number;

  @Prop({
    default: 0,
  })
  reviewAvgRating: number;

  @Prop({
    default: 0,
  })
  reviewCount: number;

  @Prop({
    default: 0,
  })
  favCount: number;

  @Prop({
    default: 0,
  })
  likeCount: number;

  @Prop({
    default: [],
  })
  tags: { name: string }[];
}

export const ToolSchema = SchemaFactory.createForClass(Tool);
