import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { Story, StorySchema } from './schemas/story.schema';
import { Planning, PlanningSchema } from './schemas/planning.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StoryController } from './story/story.controller';
import { StoryService } from './story/story.service';
import { VotingService } from './voting/voting.service';
import { VotingController } from './voting/voting.controller';
import { PlanningGateway } from './planning.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { ResourcesModule } from 'src/resources/resources.module';

@Module({
  imports: [
    AuthModule,
    ResourcesModule,
    MongooseModule.forFeature([
      { name: Planning.name, schema: PlanningSchema },
    ]),
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
  ],
  controllers: [PlanningController, StoryController, VotingController],
  providers: [PlanningService, StoryService, VotingService, PlanningGateway],
})
export class PlanningModule {}
