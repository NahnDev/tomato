import { IsNumber, IsString } from 'class-validator';

export class FileDto {
  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsString()
  mimetype: string;

  @IsNumber()
  size: number;
}
