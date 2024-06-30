import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UseInterceptors, applyDecorators } from '@nestjs/common';

export const PlaningEvent = 'planing:changed';
export const UserPlaningEvent = 'planing/user:changed';

@Injectable()
export class PlaningEventInterceptor implements NestInterceptor {
  constructor(private eventEmitter: EventEmitter2) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((response) => {
        this.eventEmitter.emit(PlaningEvent, response);
      }),
    );
  }
}

export default function UsePlaningEvent() {
  return applyDecorators(UseInterceptors(PlaningEventInterceptor));
}
