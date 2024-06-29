import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UseResponse } from 'src/decorator/UseResponse';
import { Story } from '../schemas/story.schema';
import {
  ActionStoryDto,
  CreateStoryDto,
  UpdateStoryDto,
} from '../dto/story.dto';
import { StoryService } from './story.service';
import { Planing } from '../schemas/planing.schema';

@Controller('/stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get()
  @UseResponse(Story)
  findAllStories(@Query('planing') planing: string) {
    return this.storyService.findByPlaning(planing);
  }

  @Put()
  @UseResponse(Planing)
  actions(@Query('planing') planing: string, @Body() dto: ActionStoryDto) {
    if (dto.sort) {
      return this.storyService.sortStories(planing, dto);
    }
    return;
  }

  @Post()
  @UseResponse(Story)
  createOne(@Query('planing') planing: string, @Body() dto: CreateStoryDto) {
    return this.storyService.create(dto);
  }

  @Get(':id')
  @UseResponse(Story)
  findOne(@Param('id') id: string) {
    return this.storyService.find(id);
  }

  @Put(':id')
  @UseResponse(Story)
  update(@Param('id') id: string, @Body() dto: UpdateStoryDto) {
    return this.storyService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storyService.deleteOne(id);
  }
}
