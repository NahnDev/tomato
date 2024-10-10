import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform, Type } from 'class-transformer';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Meeting {
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: string;

  @Expose()
  @Prop({ type: SchemaTypes.String, required: true })
  name: string;

  @Expose()
  @Type(() => User)
  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: User.name, autopopulate: true }],
    required: true,
    default: [],
  })
  users: User[];
}

export type MeetingDocument = HydratedDocument<Meeting>;
export const MeetingSchema = SchemaFactory.createForClass(Meeting).plugin(
  autopopulate as any,
);
