import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/decorator/Public';
import { UseResponse } from 'src/decorator/UseResponse';
import { GetUsersResponseDto } from './dto/get-users.response.dto';

@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseResponse(GetUsersResponseDto)
  public async findAll() {
    return {
      data: await this.usersService.findAll(),
    };
  }
}
