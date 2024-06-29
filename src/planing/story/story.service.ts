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
import { StoryStatus } from 'src/enum/StoryStatus';
import { CronJob } from 'cron';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
    @InjectModel(Planing.name) private readonly planingModel: Model<Planing>,
  ) {}

  findOne(_id: string) {
    return this.storyModel.findOne({ _id }).exec();
  }

  findByPlaning(planing: string) {
    return this.storyModel.find({ planing }).exec();
  }

  async create(dto: CreateStoryDto) {
    const order = await this.storyModel
      .countDocuments({ planing: dto.planing })
      .exec();
    return new this.storyModel({ ...dto, order }).save();
  }

  find(_id: string) {
    return this.storyModel.find({ _id }).exec();
  }

  async update(_id: string, dto: UpdateStoryDto) {
    return this.storyModel.findOneAndUpdate({ _id }, dto, { new: true }).exec();
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

  /**
   * Update the status of a story
   * @param storyId
   * @param status
   * @returns
   */
  async updateStatus(storyId: Story['_id'], status: StoryStatus) {
    const story = await this.storyModel.findOne({ _id: storyId }).exec();
    switch (status) {
      case StoryStatus.VOTING: {
        const job = new CronJob(new Date(Date.now() + 5000), async () => {
          await this.updateStatus(storyId, StoryStatus.FINISHED);
        });
        job.start();
        return this.storyModel
          .findOneAndUpdate(
            { _id: storyId },
            { status: StoryStatus.VOTING, startAt: Date.now() },
            { new: true },
          )
          .exec();
      }
      case StoryStatus.WAITING: {
        return this.storyModel
          .findOneAndUpdate(
            { _id: storyId },
            { status: StoryStatus.WAITING },
            { new: true },
          )
          .exec();
      }
      case StoryStatus.FINISHED: {
        return this.storyModel
          .findOneAndUpdate(
            { _id: storyId },
            { status: StoryStatus.FINISHED },
            { new: true },
          )
          .exec();
      }
      case StoryStatus.SKIPPED: {
        await this.storyModel
          .updateOne(
            { _id: storyId },
            { status: StoryStatus.SKIPPED },
            { new: true },
          )
          .exec();
        return this.storyModel
          .findOne({ planing: story.planing, order: story.order + 1 })
          .exec();
      }
    }
    return story;
  }
}
