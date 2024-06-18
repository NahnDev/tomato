import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaningGateway } from './planing/planing.gateway';
import { PlaningsModule } from './planings/planings.module';

@Module({
  imports: [PlaningsModule],
  controllers: [AppController],
  providers: [AppService, PlaningGateway],
})
export class AppModule {}
