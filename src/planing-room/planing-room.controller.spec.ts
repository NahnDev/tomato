import { Test, TestingModule } from '@nestjs/testing';
import { PlaningRoomController } from './planing-room.controller';
import { PlaningRoomService } from './planing-room.service';

describe('PlaningRoomController', () => {
  let controller: PlaningRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaningRoomController],
      providers: [PlaningRoomService],
    }).compile();

    controller = module.get<PlaningRoomController>(PlaningRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
