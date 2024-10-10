import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UseWsGuard } from 'src/decorator/UseWsGuard';
import { MeetingService, OnMeetingUserAddedEvent } from './meeting.service';

@UseWsGuard()
@WebSocketGateway({ namespace: 'meetings', cors: true })
export class MeetingGateway {
  constructor(
    private readonly authService: AuthService,
    private readonly meetingService: MeetingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const user = await this.authService.getUserByToken(token);
    if (!user) client.disconnect();
    const room = client.handshake.query.id as string;
    client.join(room);
    this.meetingService.addUser(room, user._id);
    this.server.to(room).emit(OnMeetingUserAddedEvent, user);
  }

  async handleDisconnect(client: any) {
    const token = client.handshake.auth.token;
    const user = await this.authService.getUserByToken(token);
    const room = client.handshake.query.id as string;
    if (user) {
      this.meetingService.removeUser(room, user._id);
      this.server.to(room).emit(OnMeetingUserAddedEvent, user);
    }
  }
}
