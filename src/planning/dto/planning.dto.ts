import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { StoryStatus } from 'src/enum/StoryStatus';

export class CreatePlanningDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  masters: User[];
  users: User[];
}

export class UpdatePlanningDto extends PartialType(CreatePlanningDto) {}

export class StatusVotingDto {
  @IsString()
  status: StoryStatus;
}

export class AddVotingDto {
  @IsNumber()
  value: number;
}

export class ImportStoriesDto {
  @IsString()
  column: string;

  @IsString()
  resource: string;
}
