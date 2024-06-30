import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UseJwtGuard } from 'src/decorator/UseJwtGuard';
import { UseResponse } from 'src/decorator/UseResponse';
import { Story } from '../schemas/story.schema';
import { VotingService } from './voting.service';
import { AddVotingDto, StatusVotingDto } from '../dto/planing.dto';
import { RequestUser } from 'src/decorator/RequestUser';
import { User } from 'src/users/schemas/user.schema';
import { SetVotingDto } from '../dto/story.dto';

@UseJwtGuard()
@Controller('/planings/:id/voting')
export class VotingController {
  constructor(private readonly votingService: VotingService) {}

  @UseResponse(Story)
  @Get()
  getVoting(@Param('id') id: string) {
    return this.votingService.findCurrent(id);
  }

  @UseResponse(Story)
  @Post()
  setFocus(@Param('id') id: string, @Body() dto: SetVotingDto) {
    return this.votingService.setFocus(id, dto.story);
  }

  @UseResponse(Story)
  @Put()
  async changeStatus(@Param('id') id: string, @Body() dto: StatusVotingDto) {
    const story = await this.votingService.findCurrent(id);
    if (!story) return null;
    return this.votingService.updateStatus(story, dto.status);
  }

  @UseResponse(Story)
  @Post('/votes')
  vote(
    @Param('id') id: string,
    @Body() dto: AddVotingDto,
    @RequestUser() user: User,
  ) {
    return this.votingService.addVote(id, user, dto.value);
  }

  @UseResponse(Story)
  @Post('/actions/:action')
  next(@Param('id') id: string, @Param('action') action: string) {
    if (action === 'next') return this.votingService.next(id);
    if (action === 'skip') return this.votingService.skip(id);
    return this.votingService.findCurrent(id);
  }
}
