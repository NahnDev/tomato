import { Injectable } from '@nestjs/common';
import { UpdatePlaningDto, CreatePlaningDto } from './dto/planing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Planing } from './schemas/planing.schema';
import { StoryService } from './story/story.service';
import { PlaningEvent } from './decorator/UsePlaningUserEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CsvService } from 'src/resources/csv/csv.service';
import { ResourcesService } from 'src/resources/resources.service';

@Injectable()
export class PlaningService {
  constructor(
    @InjectModel(Planing.name) private planingModel: Model<Planing>,
    private readonly storyService: StoryService,
    private readonly eventEmitter: EventEmitter2,
    private readonly csvService: CsvService,
    private readonly resourcesService: ResourcesService,
  ) {}
  create(createPlaningDto: CreatePlaningDto) {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const planing = new this.planingModel({ ...createPlaningDto, color });
    return planing.save();
  }

  findAll() {
    return this.planingModel.find().sort({ createAt: -1 }).exec();
  }

  findOne(_id: string) {
    return this.planingModel.findOne({ _id }).exec();
  }

  update(_id: string, dto: UpdatePlaningDto) {
    return this.planingModel.findOneAndUpdate({ _id }, dto);
  }

  remove(_id: string) {
    return this.planingModel.deleteOne({ _id }).exec();
  }

  async addUser(_id: string, userId: string) {
    const planing = await this.planingModel.findOneAndUpdate(
      { _id },
      { $addToSet: { users: userId } },
      { new: true },
    );
    this.eventEmitter.emit(PlaningEvent, planing);
    return planing;
  }

  async removeUser(_id: string, userId: string) {
    const planing = await this.planingModel.findOneAndUpdate(
      { _id },
      { $pull: { users: userId } },
      { new: true },
    );
    this.eventEmitter.emit(PlaningEvent, planing);
  }

  async importFromCsv(_id: string, resourceId: string, column: string) {
    const resource = await this.resourcesService.findOne(resourceId);
    const data = await this.csvService.getColumns(resource, column);
    return this.storyService.createMany(_id, data as string[]);
  }
}
