import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { StoryStatus } from 'src/enum/StoryStatus';

export class CreateStoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  planing: string;
}

export class UpdateStoryDto extends PartialType(
  PickType(CreateStoryDto, ['title']),
) {
  @IsOptional()
  @IsString()
  status: StoryStatus;
}

export class ActionStoryDto {
  @IsOptional()
  @Type(() => String)
  sort: string[];
}

export class SetVotingDto {
  @IsString()
  story: string;
}
