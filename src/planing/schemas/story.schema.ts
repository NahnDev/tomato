import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform, Type } from 'class-transformer';
import Vote, { TVoteSchema } from './vote.schema';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';
import { StoryStatus } from 'src/enum/StoryStatus';

@Schema()
export class Story {
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: string;

  @Expose()
  @Prop({ required: true, type: String })
  title: string;

  @Expose()
  @Transform(({ value }) => value.toString())
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  planing: string;

  @Expose()
  @Prop({ required: true, type: SchemaTypes.Number })
  order: number;

  @Expose()
  @Type(() => Vote)
  @Prop({ required: true, type: [TVoteSchema], default: [] })
  votes: Vote[];

  @Expose()
  @Prop({ required: true, type: Boolean, default: false })
  isCurrent: boolean;

  @Expose()
  @Prop({
    required: true,
    type: String,
    enum: Object.values(StoryStatus),
    default: StoryStatus.WAITING,
  })
  status: StoryStatus;

  @Expose()
  @Prop({ type: Number, default: null })
  startAt: number;
}

export type StoryDocument = HydratedDocument<Story>;
export const StorySchema = SchemaFactory.createForClass(Story).plugin(
  autopopulate as any,
);
