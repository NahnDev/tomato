import { Test, TestingModule } from '@nestjs/testing';
import { PlaningRoomService } from './planing-room.service';

describe('PlaningRoomService', () => {
  let service: PlaningRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaningRoomService],
    }).compile();

    service = module.get<PlaningRoomService>(PlaningRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
