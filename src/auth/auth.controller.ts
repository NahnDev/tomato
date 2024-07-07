import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/decorator/Public';
import { UseResponse } from 'src/decorator/UseResponse';
import { LoginResponseDto } from './dto/login.response.dto';
import { UseJwtGuard } from 'src/decorator/UseJwtGuard';
import { RequestUser } from 'src/decorator/RequestUser';
import { User } from 'src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  @UseResponse(LoginResponseDto)
  async login(@Request() req, @Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('auto-login')
  @UseResponse(LoginResponseDto)
  @UseJwtGuard()
  async remember(@RequestUser() user: User) {
    return this.authService.getCredentials(user);
  }
}
