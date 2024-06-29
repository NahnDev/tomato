import { Type } from 'class-transformer';
import { User } from '../schemas/user.schema';

export class GetUsersResponseDto {
  @Type(() => User)
  data: User[];
}
