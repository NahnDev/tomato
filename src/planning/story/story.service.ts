import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story } from '../schemas/story.schema';
import { Model } from 'mongoose';
import {
  ActionStoryDto,
  CreateStoryDto,
  UpdateStoryDto,
} from '../dto/story.dto';
import { Planning } from '../schemas/planning.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VotingEvent } from '../decorator/UseVotingEvent';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
    @InjectModel(Planning.name) private readonly planningModel: Model<Planning>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findOne(_id: string) {
    return this.storyModel.findOne({ _id }).exec();
  }

  findByPlanning(planning: string) {
    return this.storyModel.find({ planning }).sort({ order: 1 }).exec();
  }

  async create(dto: CreateStoryDto) {
    const order = await this.storyModel
      .countDocuments({ planning: dto.planning })
      .exec();
    return new this.storyModel({ ...dto, order }).save();
  }

  async createMany(planning: string, titles: CreateStoryDto['title'][]) {
    const order = await this.storyModel.countDocuments({ planning }).exec();
    return this.storyModel.insertMany(
      titles.map((title, index) => ({ title, planning, order: order + index })),
    );
  }

  find(_id: string) {
    return this.storyModel.find({ _id }).exec();
  }

  async update(_id: string, dto: UpdateStoryDto) {
    const nextStory = await this.storyModel
      .findOneAndUpdate({ _id }, dto, { new: true })
      .exec();
    if (nextStory.isCurrent) this.eventEmitter.emit(VotingEvent, nextStory);
    return nextStory;
  }

  deleteOne(_id: string) {
    this.storyModel.deleteOne({ _id }).exec();
    this.planningModel.updateMany({ _id }, { $pull: { stories: _id } }).exec();
  }

  sortStories(planning: string, dto: ActionStoryDto) {
    dto.sort.forEach((_id, index) => {
      this.storyModel.updateOne({ _id, planning }, { order: index }).exec();
    });
  }
}
