import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';

@Schema()
export class User {
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: string;

  @Expose()
  @Prop({ required: true, type: String })
  name: string;

  @Expose()
  @Prop({ type: String })
  avatar: string;

  @Expose()
  @Prop({ required: true, type: String, unique: true })
  mail: string;

  @Exclude()
  @Prop({ required: true, type: String })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User).plugin(
  autopopulate as any,
);
UserSchema.index(
  { mail: 1 },
  { unique: true, partialFilterExpression: { mail: { $ne: null } } },
);
export type UserDocument = HydratedDocument<User>;
