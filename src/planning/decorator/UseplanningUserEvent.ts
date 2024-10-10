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

export const PlanningEvent = 'planning:changed';
export const UserPlanningEvent = 'planning/user:changed';

@Injectable()
export class PlanningEventInterceptor implements NestInterceptor {
  constructor(private eventEmitter: EventEmitter2) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((response) => {
        this.eventEmitter.emit(PlanningEvent, response);
      }),
    );
  }
}

export default function UsePlanningEvent() {
  return applyDecorators(UseInterceptors(PlanningEventInterceptor));
}
