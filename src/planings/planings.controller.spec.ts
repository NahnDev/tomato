import { Test, TestingModule } from '@nestjs/testing';
import { PlaningsController } from './planings.controller';
import { PlaningsService } from './planings.service';

describe('PlaningsController', () => {
  let controller: PlaningsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaningsController],
      providers: [PlaningsService],
    }).compile();

    controller = module.get<PlaningsController>(PlaningsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
