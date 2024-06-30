import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { WsJwtGuard } from 'src/auth/WsJwtGuard';

export function UseWsGuard() {
  return applyDecorators(UseGuards(WsJwtGuard), ApiBearerAuth());
}
