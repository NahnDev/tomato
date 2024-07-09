import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  Put,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/resource.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseResponse } from 'src/decorator/UseResponse';
import { Resource } from './schemas/resource.schema';
import { UseJwtGuard } from 'src/decorator/UseJwtGuard';
import { RequestUser } from 'src/decorator/RequestUser';
import { User } from 'src/users/schemas/user.schema';
import * as fs from 'fs';
import { FileDto } from './dto/file.dto';
import PathHelper from 'src/helpers/PathHelper';
import { createReadStream } from 'fs';

@UseJwtGuard()
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @UseResponse(Resource)
  create(
    @Body() createResourceDto: CreateResourceDto,
    @RequestUser() user: User,
  ) {
    createResourceDto.user = user._id;
    createResourceDto.isDirectory = true;
    return this.resourcesService.create(createResourceDto);
  }

  @Get()
  @UseResponse(Resource)
  findAll(@Query('directory') directory: string) {
    return this.resourcesService.findAllByDirectory(directory);
  }

  @Get(':id')
  @UseResponse(Resource)
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @Put(':id')
  @UseResponse(Resource)
  update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourcesService.update(id, updateResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}

@UseJwtGuard()
@Controller('resource-files')
export class UploadController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @UseResponse(Resource)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1024 * 1024 * 10 },
      dest: PathHelper.getTempDir(),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: User,
    @Query('directory') directory: string,
  ) {
    const destinationPath = PathHelper.getPublicFilePath(file.originalname);
    fs.copyFileSync(file.path, destinationPath);
    const dto = new CreateResourceDto();
    const fileDto = new FileDto();

    fileDto.filename = file.originalname;
    fileDto.mimetype = file.mimetype;
    fileDto.size = file.size;
    fileDto.path = destinationPath;

    dto.directory = directory;
    dto.user = user._id;
    dto.title = file.originalname;

    return this.resourcesService.uploadFile(dto, fileDto);
  }

  @Get(':id')
  async getFile(@Param('id') _id: string): Promise<StreamableFile> {
    const resource = await this.resourcesService.findOne(_id);
    const isNotfound = !(resource && resource.file);
    if (isNotfound) throw new NotFoundException();

    const file = createReadStream(resource.file.path);
    return new StreamableFile(file);
  }
}
