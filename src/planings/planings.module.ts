import { Module } from '@nestjs/common';
import { PlaningsService } from './planings.service';
import { PlaningsController } from './planings.controller';

@Module({
  controllers: [PlaningsController],
  providers: [PlaningsService],
})
export class PlaningsModule {}
