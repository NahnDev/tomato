import { Injectable } from '@nestjs/common';
import { UpdatePlanningDto, CreatePlanningDto } from './dto/planning.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Planning } from './schemas/planning.schema';
import { StoryService } from './story/story.service';
import { PlanningEvent } from './decorator/UsePlanningUserEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CsvService } from 'src/resources/csv/csv.service';
import { ResourcesService } from 'src/resources/resources.service';

@Injectable()
export class PlanningService {
  constructor(
    @InjectModel(Planning.name) private planningModel: Model<Planning>,
    private readonly storyService: StoryService,
    private readonly eventEmitter: EventEmitter2,
    private readonly csvService: CsvService,
    private readonly resourcesService: ResourcesService,
  ) {}
  create(createPlanningDto: CreatePlanningDto) {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const planning = new this.planningModel({ ...createPlanningDto, color });
    return planning.save();
  }

  findAll() {
    return this.planningModel.find().sort({ createAt: -1 }).exec();
  }

  findOne(_id: string) {
    return this.planningModel.findOne({ _id }).exec();
  }

  update(_id: string, dto: UpdatePlanningDto) {
    return this.planningModel.findOneAndUpdate({ _id }, dto);
  }

  remove(_id: string) {
    return this.planningModel.deleteOne({ _id }).exec();
  }

  async addUser(_id: string, userId: string) {
    const planning = await this.planningModel.findOneAndUpdate(
      { _id },
      { $addToSet: { users: userId } },
      { new: true },
    );
    this.eventEmitter.emit(PlanningEvent, planning);
    return planning;
  }

  async removeUser(_id: string, userId: string) {
    const planning = await this.planningModel.findOneAndUpdate(
      { _id },
      { $pull: { users: userId } },
      { new: true },
    );
    this.eventEmitter.emit(PlanningEvent, planning);
  }

  async importFromCsv(_id: string, resourceId: string, column: string) {
    const resource = await this.resourcesService.findOne(resourceId);
    const data = await this.csvService.getColumns(resource, column);
    return this.storyService.createMany(_id, data as string[]);
  }
}
