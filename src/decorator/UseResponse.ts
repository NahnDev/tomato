import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

export class TransformInterceptor<T> implements NestInterceptor<T, T | T[]> {
  constructor(private readonly classType: new (...args: any[]) => T) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | T[]> {
    return next
      .handle()
      .pipe(
        map((data) =>
          Array.isArray(data)
            ? data.map((item) => plainToClass(this.classType, toPlain(item)))
            : plainToClass(this.classType, toPlain(data)),
        ),
      );
  }
}

export function UseResponse<T>(classType: new (...args: any[]) => T) {
  return UseInterceptors(new TransformInterceptor(classType));
}

export function toPlain(data: any) {
  if (data instanceof Document) return data.toObject();
  return data;
}
