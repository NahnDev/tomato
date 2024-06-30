import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './JwtAuthGuard';
import { WsJwtGuard } from './WsJwtGuard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    WsJwtGuard,
    { useClass: JwtAuthGuard, provide: APP_GUARD },
  ],
  exports: [AuthService],
})
export class AuthModule {}
