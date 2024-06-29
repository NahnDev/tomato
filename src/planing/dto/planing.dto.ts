import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { StoryStatus } from 'src/enum/StoryStatus';

export class CreatePlaningDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  masters: User[];
  users: User[];
}

export class UpdatePlaningDto extends PartialType(CreatePlaningDto) {}

export class StatusVotingDto {
  @IsString()
  status: StoryStatus;
}

export class AddVotingDto {
  @IsNumber()
  value: number;
}