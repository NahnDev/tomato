import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { UseJwtGuard } from 'src/decorator/UseJwtGuard';
import { UseResponse } from 'src/decorator/UseResponse';
import { Meeting } from './schemas/meeting.schema';

@UseJwtGuard()
@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  @UseResponse(Meeting)
  create(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingService.create(createMeetingDto);
  }

  @Get()
  @UseResponse(Meeting)
  findAll() {
    return this.meetingService.findAll();
  }

  @Get(':id')
  @UseResponse(Meeting)
  findOne(@Param('id') id: string) {
    return this.meetingService.findOne(id);
  }

  @Patch(':id')
  @UseResponse(Meeting)
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingService.update(id, updateMeetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingService.remove(id);
  }
}
