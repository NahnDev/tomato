import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseWsGuard } from '../decorator/UseWsGuard';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PlanningService } from './planning.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Story } from './schemas/story.schema';
import { PlanningEvent } from './decorator/UsePlanningUserEvent';
import { VotingEvent } from './decorator/UseVotingEvent';
import { Planning } from './schemas/planning.schema';
import { UseResponse } from 'src/decorator/UseResponse';

@UseWsGuard()
@WebSocketGateway({ namespace: 'planning', cors: true })
export class PlanningGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly planningServer: PlanningService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const user = await this.authService.getUserByToken(token);
    if (!user) client.disconnect();
    const room = client.handshake.query.planning as string;
    client.join(room);
    this.planningServer.addUser(room, user._id);
  }

  async handleDisconnect(client: any) {
    const token = client.handshake.auth.token;
    const user = await this.authService.getUserByToken(token);
    const room = client.handshake.query.planning as string;
    if (user) {
      this.planningServer.removeUser(room, user._id);
    }
  }

  @OnEvent(VotingEvent)
  @UseResponse(Story)
  onStoryChanged(payload: Story) {
    this.server.to(payload.planning.toString()).emit(VotingEvent, payload);
  }

  @OnEvent(PlanningEvent)
  @UseResponse(Planning)
  onPlanningChanged(payload: Planning) {
    this.server.to(payload._id.toString()).emit(PlanningEvent, payload);
  }
}
