import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController, UploadController } from './resources.controller';
import { LocalFile, LocalFileSchema } from './schemas/file.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Resource, ResourceSchema } from './schemas/resource.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LocalFile.name, schema: LocalFileSchema },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Resource.name,
        useFactory: () => {
          const schema = ResourceSchema;
          schema.pre('deleteOne', async function () {
            const doc = await this.model.findOne(this.getFilter());
            this.model.deleteMany({ directory: doc._id }).exec();
          });
          schema.pre('deleteMany', async function () {
            const docs = await this.model.find(this.getFilter());
            for (const doc of docs) {
              this.model.deleteMany({ directory: doc._id }).exec();
            }
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [ResourcesController, UploadController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
