import { IsString, IsEmail, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  mail: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
