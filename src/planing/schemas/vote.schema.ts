import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import * as autopopulate from 'mongoose-autopopulate';

@Schema()
export default class Vote {
  @Expose()
  @Type(() => User)
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  user: string;

  @Expose()
  @Prop({ type: Number })
  value?: number;

  @Expose()
  @Prop({ required: true, type: Number })
  at: number;
}

export type TVoteDocument = Vote & Document;
export const TVoteSchema = SchemaFactory.createForClass(Vote).plugin(
  autopopulate as any,
);
