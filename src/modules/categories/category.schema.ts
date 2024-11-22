import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

// create a validation or index for name field to be unique

@Schema({ timestamps: true })
export class Category {
  @Prop({
    isRequired: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories',
    default: null,
  })
  parentCategoryId: string;

  @Prop({
    default: 0,
  })
  ranking: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
