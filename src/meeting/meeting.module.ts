import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { MeetingGateway } from './meeting.gateway';
import { Meeting, MeetingSchema } from './schemas/meeting.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]),
  ],
  controllers: [MeetingController],
  providers: [MeetingService, MeetingGateway],
})
export class MeetingModule {}
