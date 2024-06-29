import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StoryStatus } from 'src/enum/StoryStatus';
import { Story } from '../schemas/story.schema';
import { Model } from 'mongoose';
import { StoryService } from '../story/story.service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class VotingService {
  constructor(
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
    private readonly storyService: StoryService,
  ) {}

  async setFocus(planing: string, _id: string) {
    await this.storyModel.updateMany({ planing }, { isCurrent: false });
    await this.storyModel.updateMany(
      {
        planing,
        status: { $nin: [StoryStatus.FINISHED, StoryStatus.SKIPPED] },
      },
      { status: StoryStatus.WAITING },
    );
    return this.storyModel
      .findOneAndUpdate({ _id }, { isCurrent: true })
      .exec();
  }

  async next(planing: string) {
    const story = await this.findCurrent(planing);
    const nextStory = await this.storyModel
      .findOne(
        {
          planing,
          order: { $gt: story.order },
          status: { $nin: [StoryStatus.FINISHED] },
        },
        { order: 1 },
      )
      .exec();
    if (!nextStory) return null;
    return this.setFocus(planing, nextStory._id);
  }

  async skip(planing: string) {
    const story = await this.findCurrent(planing);
    await this.storyModel.updateOne(
      { _id: story._id },
      { status: StoryStatus.SKIPPED },
    );
    const nextStory = await this.storyModel
      .findOne(
        {
          planing,
          order: { $gt: story.order },
          status: { $nin: [StoryStatus.FINISHED] },
        },
        { order: 1 },
      )
      .exec();
    if (!nextStory) return null;
    return this.setFocus(planing, nextStory._id);
  }

  findOne(_id: string) {
    return this.storyModel.findById(_id).exec();
  }

  findCurrent(planing: string) {
    return this.storyModel
      .findOne({
        planing,
        isCurrent: true,
      })
      .exec();
  }

  async updateStatus(planing: string, status: StoryStatus) {
    const story = await this.findCurrent(planing);
    return this.storyService.updateStatus(story._id, status);
  }

  async addVote(planing: string, user: User, value: number) {
    const story = await this.findCurrent(planing);
    const existingVote = story.votes.find(
      (vote) => vote.user.toString() === user._id.toString(),
    );

    if (existingVote) {
      return this.storyModel
        .findOneAndUpdate(
          { _id: story._id, 'votes.user': user._id },
          { $set: { 'votes.$.value': value } },
          { new: true },
        )
        .exec();
    } else {
      return this.storyModel
        .findOneAndUpdate(
          { _id: story._id },
          { $push: { votes: { user: user._id, value: value } } },
          { new: true },
        )
        .exec();
    }
  }
}
