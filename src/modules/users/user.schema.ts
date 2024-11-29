import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: string;
  createdAt: string;
  updatedAt: string;

  @Prop({
    isRequired: true,
  })
  nickname: string;

  @Prop({
    isRequired: true,
  })
  email: string;

  @Prop({
    isRequired: true,
  })
  avatarUrl: string;

  @Prop({
    default: false,
  })
  isGoogleUser: boolean;

  @Prop({
    default: false,
  })
  isGithubUser: boolean;

  @Prop({
    isRequired: true,
    type: Object,
  })
  sourceData: any;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
