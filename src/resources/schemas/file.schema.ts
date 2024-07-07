import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import { HydratedDocument, SchemaTypes } from 'mongoose';

@Schema()
export class LocalFile {
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: string;

  @Expose()
  @Prop({ type: SchemaTypes.String, required: true })
  filename: string;

  @Prop({ type: SchemaTypes.String, required: true })
  path: string;

  @Expose()
  @Prop({ type: SchemaTypes.Number, required: true })
  size: number;

  @Expose()
  @Prop({ type: SchemaTypes.String, required: true })
  mimetype: string;
}

export type LocalFileDocument = HydratedDocument<LocalFile>;
export const LocalFileSchema = SchemaFactory.createForClass(LocalFile);
