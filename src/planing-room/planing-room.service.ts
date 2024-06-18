import { Injectable } from '@nestjs/common';
import { CreatePlaningRoomDto } from './dto/create-planing-room.dto';
import { UpdatePlaningRoomDto } from './dto/update-planing-room.dto';

@Injectable()
export class PlaningRoomService {
  create(createPlaningRoomDto: CreatePlaningRoomDto) {
    return 'This action adds a new planingRoom';
  }

  findAll() {
    return `This action returns all planingRoom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planingRoom`;
  }

  update(id: number, updatePlaningRoomDto: UpdatePlaningRoomDto) {
    return `This action updates a #${id} planingRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} planingRoom`;
  }
}
