import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class PlaningGateway {
  @SubscribeMessage('join')
  handleMessage(client: any, payload: any) {
    client.to(payload.room).broadcast.emit('joined', payload);
  }

  @SubscribeMessage('leave')
  handleLeave(client: any, payload: any) {
    client.to(payload.room).broadcast.emit('leaved', payload);
  }

  @SubscribeMessage('sync')
  handleSync(client: any, payload: any) {
    client.to(payload.room).broadcast.emit('synced', payload);
  }

  @SubscribeMessage('point')
  handlePoint(client: any, payload: any) {
    client.to(payload.room).broadcast.emit('pointed', payload);
  }
}
