import { PartialType } from '@nestjs/swagger';
import { CreatePlaningDto } from './create-planing.dto';

export class UpdatePlaningDto extends PartialType(CreatePlaningDto) {}
