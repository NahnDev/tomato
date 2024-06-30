import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseWsGuard } from '../decorator/UseWsGuard';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PlaningService } from './planing.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Story } from './schemas/story.schema';
import { PlaningEvent } from './decorator/UsePlaningUserEvent';
import { VotingEvent } from './decorator/UseVotingEvent';
import { Planing } from './schemas/planing.schema';
import { UseResponse } from 'src/decorator/UseResponse';

@UseWsGuard()
@WebSocketGateway({ namespace: 'planing', cors: true })
export class PlaningGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly planingServer: PlaningService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const user = await this.authService.getUserByToken(token);
    if (!user) client.disconnect();
    const room = client.handshake.query.planing as string;
    client.join(room);
    this.planingServer.addUser(room, user._id);
  }

  async handleDisconnect(client: any) {
    const token = client.handshake.auth.token;
    const user = await this.authService.getUserByToken(token);
    const room = client.handshake.query.planing as string;
    if (user) {
      this.planingServer.removeUser(room, user._id);
    }
  }

  @OnEvent(VotingEvent)
  @UseResponse(Story)
  onStoryChanged(payload: Story) {
    this.server.to(payload.planing.toString()).emit(VotingEvent, payload);
  }

  @OnEvent(PlaningEvent)
  @UseResponse(Planing)
  onPlaningChanged(payload: Planing) {
    this.server.to(payload._id.toString()).emit(PlaningEvent, payload);
  }
}
