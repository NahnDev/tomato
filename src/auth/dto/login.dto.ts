import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsString()
  mail: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}
