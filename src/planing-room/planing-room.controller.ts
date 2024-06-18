import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlaningRoomService } from './planing-room.service';
import { CreatePlaningRoomDto } from './dto/create-planing-room.dto';
import { UpdatePlaningRoomDto } from './dto/update-planing-room.dto';

@Controller('planing-room')
export class PlaningRoomController {
  constructor(private readonly planingRoomService: PlaningRoomService) {}

  @Post()
  create(@Body() createPlaningRoomDto: CreatePlaningRoomDto) {
    return this.planingRoomService.create(createPlaningRoomDto);
  }

  @Get()
  findAll() {
    return this.planingRoomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planingRoomService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaningRoomDto: UpdatePlaningRoomDto,
  ) {
    return this.planingRoomService.update(+id, updatePlaningRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planingRoomService.remove(+id);
  }
}
