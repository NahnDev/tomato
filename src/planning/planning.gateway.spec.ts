import { Test, TestingModule } from '@nestjs/testing';
import { PlanningGateway } from './planning.gateway';

describe('PlanningGateway', () => {
  let gateway: PlanningGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanningGateway],
    }).compile();

    gateway = module.get<PlanningGateway>(PlanningGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
