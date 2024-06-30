import { Global, Module } from '@nestjs/common';
import EventEmitter from './EventEmitter';

@Global()
@Module({
  providers: [EventEmitter],
  exports: [EventEmitter],
})
export class EventModule {}
