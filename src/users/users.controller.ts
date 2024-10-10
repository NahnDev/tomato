import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/decorator/Public';
import { UseResponse } from 'src/decorator/UseResponse';
import { User } from './schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import PathHelper from 'src/helpers/PathHelper';
import { Resource } from 'src/resources/schemas/resource.schema';
import * as fs from 'fs';

@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseResponse(User)
  public async findAll() {
    return await this.usersService.findAll();
  }

  @Post('/:id/avatar')
  @UseResponse(Resource)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1024 * 1024 * 10 },
      dest: PathHelper.getTempDir(),
    }),
  )
  setAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const destinationPath = PathHelper.getPublicFilePath(file.originalname);
    fs.copyFileSync(file.path, destinationPath);
    return this.usersService.update(id, { avatar: destinationPath });
  }
}
