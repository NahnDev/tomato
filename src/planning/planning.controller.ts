import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PlanningService } from './planning.service';
import {
  CreatePlanningDto,
  ImportStoriesDto,
  UpdatePlanningDto,
} from './dto/planning.dto';
import { RequestUser } from 'src/decorator/RequestUser';
import { User } from 'src/users/schemas/user.schema';
import { UseResponse } from 'src/decorator/UseResponse';
import { Planning } from './schemas/planning.schema';
import { UseJwtGuard } from 'src/decorator/UseJwtGuard';
import { VotingService } from './voting/voting.service';
import UsePlanningEvent from './decorator/UsePlanningUserEvent';
import { Story } from './schemas/story.schema';

@UseJwtGuard()
@Controller('plannings')
export class PlanningController {
  constructor(
    private readonly planningService: PlanningService,
    private readonly votingService: VotingService,
  ) {}

  @Post()
  @UseResponse(Planning)
  create(@Body() dto: CreatePlanningDto, @RequestUser() user: User) {
    dto.masters = [user];
    dto.users = [user];
    const a = this.planningService.create(dto);
    return a;
  }

  @Get()
  @UseResponse(Planning)
  findAll() {
    return this.planningService.findAll();
  }

  @Get(':id')
  @UseResponse(Planning)
  findOne(@Param('id') id: string) {
    return this.planningService.findOne(id);
  }

  @Put(':id')
  @UseResponse(Planning)
  @UsePlanningEvent()
  update(@Param('id') id: string, @Body() dto: UpdatePlanningDto) {
    return this.planningService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planningService.remove(id);
  }

  @Post(':id/import')
  @UseResponse(Story)
  import(@Param('id') id: string, @Body() dto: ImportStoriesDto) {
    return this.planningService.importFromCsv(id, dto.resource, dto.column);
  }
}
