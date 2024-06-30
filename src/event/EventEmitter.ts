import { EventEmitter2 } from '@nestjs/event-emitter';
import EmitableEvent from './EmitableEvent';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class EventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  emit(event: EmitableEvent) {
    this.eventEmitter.emit(event.event, event);
  }
}
