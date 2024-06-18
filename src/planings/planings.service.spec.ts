import { Test, TestingModule } from '@nestjs/testing';
import { PlaningsService } from './planings.service';

describe('PlaningsService', () => {
  let service: PlaningsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaningsService],
    }).compile();

    service = module.get<PlaningsService>(PlaningsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
