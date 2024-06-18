import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlaningsService } from './planings.service';
import { CreatePlaningDto } from './dto/create-planing.dto';
import { UpdatePlaningDto } from './dto/update-planing.dto';

@Controller('planings')
export class PlaningsController {
  constructor(private readonly planingsService: PlaningsService) {}

  @Post()
  create(@Body() createPlaningDto: CreatePlaningDto) {
    return this.planingsService.create(createPlaningDto);
  }

  @Get()
  findAll() {
    return this.planingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaningDto: UpdatePlaningDto) {
    return this.planingsService.update(+id, updatePlaningDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planingsService.remove(+id);
  }
}
