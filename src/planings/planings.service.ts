import { Injectable } from '@nestjs/common';
import { CreatePlaningDto } from './dto/create-planing.dto';
import { UpdatePlaningDto } from './dto/update-planing.dto';

@Injectable()
export class PlaningsService {
  create(createPlaningDto: CreatePlaningDto) {
    return 'This action adds a new planing';
  }

  findAll() {
    return `This action returns all planings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planing`;
  }

  update(id: number, updatePlaningDto: UpdatePlaningDto) {
    return `This action updates a #${id} planing`;
  }

  remove(id: number) {
    return `This action removes a #${id} planing`;
  }
}
