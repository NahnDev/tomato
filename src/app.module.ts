import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlaningModule } from './planing/planing.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({ wildcard: true }),
    MongooseModule.forRoot('mongodb://localhost:27017/tomato'),
    UsersModule,
    AuthModule,
    PlaningModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
