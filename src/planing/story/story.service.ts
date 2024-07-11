import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story } from '../schemas/story.schema';
import { Model } from 'mongoose';
import {
  ActionStoryDto,
  CreateStoryDto,
  UpdateStoryDto,
} from '../dto/story.dto';
import { Planing } from '../schemas/planing.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VotingEvent } from '../decorator/UseVotingEvent';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
    @InjectModel(Planing.name) private readonly planingModel: Model<Planing>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findOne(_id: string) {
    return this.storyModel.findOne({ _id }).exec();
  }

  findByPlaning(planing: string) {
    return this.storyModel.find({ planing }).sort({ order: 1 }).exec();
  }

  async create(dto: CreateStoryDto) {
    const order = await this.storyModel
      .countDocuments({ planing: dto.planing })
      .exec();
    return new this.storyModel({ ...dto, order }).save();
  }

  async createMany(planing: string, titles: CreateStoryDto['title'][]) {
    const order = await this.storyModel.countDocuments({ planing }).exec();
    return this.storyModel.insertMany(
      titles.map((title, index) => ({ title, planing, order: order + index })),
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
    this.planingModel.updateMany({ _id }, { $pull: { stories: _id } }).exec();
  }

  sortStories(planing: string, dto: ActionStoryDto) {
    dto.sort.forEach((_id, index) => {
      this.storyModel.updateOne({ _id, planing }, { order: index }).exec();
    });
  }
}
