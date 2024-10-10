import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlanningModule } from './planning/planning.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from './event/event.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResourcesModule } from './resources/resources.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MeetingModule } from './meeting/meeting.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({ wildcard: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PlanningModule,
    EventModule,
    ResourcesModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    MeetingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
