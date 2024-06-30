import { Module } from '@nestjs/common';
import { PlaningService } from './planing.service';
import { PlaningController } from './planing.controller';
import { Story, StorySchema } from './schemas/story.schema';
import { Planing, PlaningSchema } from './schemas/planing.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StoryController } from './story/story.controller';
import { StoryService } from './story/story.service';
import { VotingService } from './voting/voting.service';
import { VotingController } from './voting/voting.controller';
import { PlaningGateway } from './planing.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Planing.name, schema: PlaningSchema }]),
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
  ],
  controllers: [PlaningController, StoryController, VotingController],
  providers: [PlaningService, StoryService, VotingService, PlaningGateway],
})
export class PlaningModule {}
