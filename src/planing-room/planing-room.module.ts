import { Module } from '@nestjs/common';
import { PlaningRoomService } from './planing-room.service';
import { PlaningRoomController } from './planing-room.controller';

@Module({
  controllers: [PlaningRoomController],
  providers: [PlaningRoomService],
})
export class PlaningRoomModule {}
