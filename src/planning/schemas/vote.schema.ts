import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import { SchemaTypes } from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';

@Schema()
export default class Vote {
  @Expose()
  @Transform(({ value }) => value.toString())
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
