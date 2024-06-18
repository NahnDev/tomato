import { Test, TestingModule } from '@nestjs/testing';
import { PlaningGateway } from './planing.gateway';

describe('PlaningGateway', () => {
  let gateway: PlaningGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaningGateway],
    }).compile();

    gateway = module.get<PlaningGateway>(PlaningGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
