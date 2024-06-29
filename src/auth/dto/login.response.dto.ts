import { Expose, Type } from 'class-transformer';
import { User } from 'src/users/schemas/user.schema';

export class LoginResponseDto {
  @Expose()
  @Type(() => User)
  user: User;
  @Expose()
  accessToken: string;
}
