import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaningGateway } from './planing/planing.gateway';
import { PlaningRoomModule } from './planing-room/planing-room.module';

@Module({
  imports: [PlaningRoomModule],
  controllers: [AppController],
  providers: [AppService, PlaningGateway],
})
export class AppModule {}
