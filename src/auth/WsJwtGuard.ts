import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient() as Socket;
    const token = socket.handshake.auth.token;
    const payload = await this.jwtService.verifyAsync(token, {
      secret: 'secretKey',
    });
    const user = await this.userService.findOne(payload.sub);
    context.switchToWs().getClient().user = user;
    return true;
  }

  private extractToken(client: Socket): string | undefined {
    const token = client.handshake.query.token as string;
    return token;
  }
}
