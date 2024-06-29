import { Injectable } from '@nestjs/common';
import { UpdatePlaningDto, CreatePlaningDto } from './dto/planing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Planing } from './schemas/planing.schema';
import { StoryService } from './story/story.service';

@Injectable()
export class PlaningService {
  constructor(
    @InjectModel(Planing.name) private planingModel: Model<Planing>,
    private readonly storyService: StoryService,
  ) {}
  create(createPlaningDto: CreatePlaningDto) {
    const planing = new this.planingModel(createPlaningDto);
    return planing.save();
  }

  findAll() {
    return this.planingModel.find().exec();
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
}
