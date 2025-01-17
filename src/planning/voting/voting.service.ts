import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StoryStatus } from 'src/enum/StoryStatus';
import { Story } from '../schemas/story.schema';
import { Model } from 'mongoose';
import { StoryService } from '../story/story.service';
import { User } from 'src/users/schemas/user.schema';
import PlanningConstant from 'src/constants/planning';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CronJob } from 'cron';
import { VotingEvent } from '../decorator/UseVotingEvent';

@Injectable()
export class VotingService {
  constructor(
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
    private readonly storyService: StoryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async setFocus(planning: string, _id: string) {
    await this.storyModel.updateMany({ planning }, { isCurrent: false });
    await this.storyModel.updateMany(
      {
        planning,
        status: { $nin: [StoryStatus.FINISHED, StoryStatus.SKIPPED] },
      },
      { status: StoryStatus.WAITING },
    );
    const story = await this.storyModel
      .findOneAndUpdate({ _id }, { isCurrent: true })
      .exec();
    this.eventEmitter.emit(VotingEvent, story);
    return story;
  }

  async next(planning: string) {
    const story = await this.findCurrent(planning);
    const nextStory = await this.storyModel
      .findOne(
        {
          planning,
          order: { $gt: story.order },
          status: { $nin: [StoryStatus.FINISHED] },
        },
        { order: 1 },
      )
      .exec();
    if (!nextStory) return null;
    return this.setFocus(planning, nextStory._id);
  }

  async skip(planning: string) {
    const story = await this.findCurrent(planning);
    await this.updateStatus(story, StoryStatus.SKIPPED);
    const nextStory = await this.storyModel
      .findOne(
        {
          planning,
          order: { $gt: story.order },
          status: { $nin: [StoryStatus.FINISHED] },
        },
        { order: 1 },
      )
      .exec();
    if (!nextStory) return null;
    return this.setFocus(planning, nextStory._id);
  }

  findCurrent(planning: string) {
    return this.storyModel
      .findOne({
        planning,
        isCurrent: true,
      })
      .exec();
  }

  async updateStatus(story: Story, status: StoryStatus) {
    let nextStory = story;
    switch (status) {
      case StoryStatus.VOTING: {
        const job = new CronJob(
          new Date(Date.now() + PlanningConstant.Remaining * 1000),
          async () => {
            await this.updateStatus(story, StoryStatus.FINISHED);
          },
        );
        job.start();
        nextStory = await this.storyModel
          .findOneAndUpdate(
            { _id: story._id },
            { status: StoryStatus.VOTING, startAt: Date.now() },
            { new: true },
          )
          .exec();
        break;
      }
      case StoryStatus.WAITING: {
        nextStory = await this.storyModel
          .findOneAndUpdate(
            { _id: story._id },
            { status: StoryStatus.WAITING },
            { new: true },
          )
          .exec();
        break;
      }
      case StoryStatus.FINISHED: {
        nextStory = await this.storyModel
          .findOneAndUpdate(
            { _id: story._id },
            { status: StoryStatus.FINISHED },
            { new: true },
          )
          .exec();
        break;
      }
      case StoryStatus.SKIPPED: {
        await this.storyModel
          .updateOne(
            { _id: story._id },
            { status: StoryStatus.SKIPPED },
            { new: true },
          )
          .exec();
        nextStory = await this.storyModel
          .findOne({ planning: story.planning, order: story.order + 1 })
          .exec();
        break;
      }
    }
    this.eventEmitter.emit(VotingEvent, nextStory);
    return nextStory;
  }

  async addVote(planning: string, user: User, value: number) {
    const story = await this.findCurrent(planning);
    const existingVote = story.votes.find(
      (vote) => vote.user.toString() === user._id.toString(),
    );
    let nextStory = story;

    if (Date.now() > story.startAt + PlanningConstant.Remaining * 1000) {
      throw new HttpException('Voting is finished', 502);
    }
    if (existingVote) {
      nextStory = await this.storyModel
        .findOneAndUpdate(
          {
            _id: story._id,
            'votes.user': user._id,
          },
          {
            $set: {
              'votes.$.value': value,
              'votes.$.at': Math.round((Date.now() - story.startAt) / 1000),
            },
          },
          { new: true },
        )
        .exec();
    } else {
      nextStory = await this.storyModel
        .findOneAndUpdate(
          { _id: story._id },
          {
            $push: {
              votes: {
                user: user._id,
                value: value,
                at: Math.round((Date.now() - story.startAt) / 1000),
              },
            },
          },
          { new: true },
        )
        .exec();
    }
    this.eventEmitter.emit(VotingEvent, nextStory);
    return nextStory;
  }
}
