import { Injectable } from '@nestjs/common';
import { CreateResourceDto, UpdateResourceDto } from './dto/resource.dto';
import { Resource } from './schemas/resource.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LocalFile } from './schemas/file.schema';
import { Model } from 'mongoose';
import { FileDto } from './dto/file.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(Resource.name) private resourceModel: Model<Resource>,
    @InjectModel(LocalFile.name) private localFileModel: Model<LocalFile>,
  ) {}

  async create(createResourceDto: CreateResourceDto) {
    const count = await this.resourceModel.countDocuments({
      directory: createResourceDto.directory,
    });
    const createdResource = new this.resourceModel({
      ...createResourceDto,
      order: count,
    });
    return createdResource.save();
  }

  findAllByDirectoryAndUser(directory: string, user: string) {
    return this.resourceModel.find({ directory, user }).exec();
  }

  findOne(_id: string) {
    return this.resourceModel.findById(_id).exec();
  }

  async update(_id: string, dto: UpdateResourceDto) {
    return this.resourceModel.findByIdAndUpdate(_id, { ...dto }, { new: true });
  }

  remove(_id: string) {
    return this.resourceModel.deleteOne({ _id });
  }

  async uploadFile(dto: CreateResourceDto, fileDto: FileDto) {
    const createdFile = new this.localFileModel({ ...fileDto });
    await createdFile.save();
    return this.create({ ...dto, file: createdFile._id });
  }
}
