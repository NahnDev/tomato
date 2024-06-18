import { PartialType } from '@nestjs/swagger';
import { CreatePlaningRoomDto } from './create-planing-room.dto';

export class UpdatePlaningRoomDto extends PartialType(CreatePlaningRoomDto) {}
