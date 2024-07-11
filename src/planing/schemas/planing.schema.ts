import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform, Type } from 'class-transformer';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Planing {
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: string;

  @Expose()
  @Prop({ type: SchemaTypes.String, required: true })
  title: string;

  @Expose()
  @Prop({ type: String, default: '' })
  description: string;

  @Expose()
  @Type(() => User)
  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: User.name, autopopulate: true }],
    required: true,
    default: [],
  })
  masters: User[];

  @Expose()
  @Type(() => User)
  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: User.name, autopopulate: true }],
    required: true,
    default: [],
  })
  users: User[];

  @Expose()
  @Prop({ type: String, default: '#000000' })
  color: string;

  @Expose()
  @Prop({ type: Number, default: Date.now })
  createdAt: Date;
}

export type PlaningDocument = HydratedDocument<Planing>;
export const PlaningSchema = SchemaFactory.createForClass(Planing).plugin(
  autopopulate as any,
);
