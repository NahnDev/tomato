import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      user,
      accessToken: this.jwtService.sign({ sub: user._id }),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.mail, dto.password);
    if (!user) throw new UnauthorizedException();
    return this.getCredentials(user);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByMail(username);
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        return user;
      }
    }
    return null;
  }

  async getCredentials(user: User) {
    return {
      user,
      accessToken: this.jwtService.sign({ sub: user._id }),
    };
  }
}
