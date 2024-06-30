import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PlaningService } from './planing.service';
import { CreatePlaningDto, UpdatePlaningDto } from './dto/planing.dto';
import { RequestUser } from 'src/decorator/RequestUser';
import { User } from 'src/users/schemas/user.schema';
import { UseResponse } from 'src/decorator/UseResponse';
import { Planing } from './schemas/planing.schema';
import { UseJwtGuard } from 'src/decorator/UseJwtGuard';
import { VotingService } from './voting/voting.service';
import UsePlaningEvent from './decorator/UsePlaningUserEvent';

@UseJwtGuard()
@Controller('planings')
export class PlaningController {
  constructor(
    private readonly planingService: PlaningService,
    private readonly votingService: VotingService,
  ) {}

  @Post()
  @UseResponse(Planing)
  create(@Body() dto: CreatePlaningDto, @RequestUser() user: User) {
    dto.masters = [user];
    dto.users = [user];
    const a = this.planingService.create(dto);
    return a;
  }

  @Get()
  @UseResponse(Planing)
  findAll() {
    return this.planingService.findAll();
  }

  @Get(':id')
  @UseResponse(Planing)
  findOne(@Param('id') id: string) {
    return this.planingService.findOne(id);
  }

  @Put(':id')
  @UseResponse(Planing)
  @UsePlaningEvent()
  update(@Param('id') id: string, @Body() dto: UpdatePlaningDto) {
    return this.planingService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planingService.remove(id);
  }
}
