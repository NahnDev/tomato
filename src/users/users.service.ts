import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByMail(mail: string) {
    return await this.userModel.findOne({ mail });
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    const user = new this.userModel(createUserDto);
    await user.save();
    return this.findOne(user._id);
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(_id: string) {
    return this.userModel.findById(_id);
  }

  update(_id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }
    return this.userModel.findByIdAndUpdate(_id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
