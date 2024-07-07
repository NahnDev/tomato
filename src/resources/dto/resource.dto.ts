import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  directory: string;

  user?: string;
  file?: string;
  isDirectory?: boolean;
}

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}
