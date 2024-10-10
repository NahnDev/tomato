import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from './schemas/meeting.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from 'src/users/users.service';

export const OnMeetingUserAddedEvent = 'meeting/user-added';
export const OnMeetingUserRemovedEvent = 'meeting/user-removed';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<Meeting>,
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UsersService,
  ) {}

  async create(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    const createdMeeting = new this.meetingModel(createMeetingDto);
    return createdMeeting.save();
  }

  async findAll(): Promise<Meeting[]> {
    return this.meetingModel.find().exec();
  }

  async findOne(id: string): Promise<Meeting> {
    return this.meetingModel.findById(id).exec();
  }

  async update(
    id: string,
    updateMeetingDto: UpdateMeetingDto,
  ): Promise<Meeting> {
    return this.meetingModel
      .findByIdAndUpdate(id, updateMeetingDto, { new: true })
      .exec();
  }

  async remove(_id: string): Promise<Meeting> {
    return this.meetingModel.findOneAndDelete({ _id }).exec();
  }

  async addUser(_id: string, userId: string) {
    await this.meetingModel.findOneAndUpdate(
      { _id },
      { $addToSet: { users: userId } },
      { new: true },
    );
  }

  async removeUser(_id: string, userId: string) {
    await this.meetingModel.findOneAndUpdate(
      { _id },
      { $pull: { users: userId } },
      { new: true },
    );
  }
}
