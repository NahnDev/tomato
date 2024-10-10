import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
