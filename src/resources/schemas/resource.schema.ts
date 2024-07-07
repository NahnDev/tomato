import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform, Type } from 'class-transformer';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { LocalFile } from './file.schema';
import * as autopopulate from 'mongoose-autopopulate';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Resource {
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: string;

  @Expose()
  @Prop({ type: SchemaTypes.String, required: true })
  title: string;

  @Expose()
  @Transform(({ value }) => value?.toString())
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Resource.name,
  })
  directory?: string;

  @Expose()
  @Prop({ type: SchemaTypes.Boolean, default: false })
  isDirectory?: boolean;

  @Expose()
  @Type(() => LocalFile)
  @Prop({ type: SchemaTypes.ObjectId, ref: LocalFile.name, autopopulate: true })
  file?: LocalFile;

  @Expose()
  @Prop({ type: SchemaTypes.Number, default: 0 })
  order: number;

  @Expose()
  @Transform(({ value }) => value.toString())
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: string;
}

export type ResourceDocument = HydratedDocument<Resource>;
export const ResourceSchema = SchemaFactory.createForClass(Resource).plugin(
  autopopulate as any,
);
