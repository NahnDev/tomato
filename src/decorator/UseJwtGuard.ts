import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function UseJwtGuard() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}
