import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UseJwtGuard } from 'src/decorator/UseJwtGuard';
import { CsvService } from './csv.service';
import { ResourcesService } from '../resources.service';

@UseJwtGuard()
@Controller('csv/:id')
export class CsvController {
  constructor(
    private readonly csvService: CsvService,
    private readonly resourceService: ResourcesService,
  ) {}

  @Get('/headers')
  async getHeader(@Param('id') id: string) {
    const resource = await this.resourceService.findOne(id);
    const isCsv = resource?.file?.mimetype === 'text/csv';
    if (!isCsv) {
      throw new NotFoundException('Resource is not a CSV file');
    }
    return this.csvService.getHeader(resource);
  }
}
