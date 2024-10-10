import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['name', 'password']),
) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar: string;
}
