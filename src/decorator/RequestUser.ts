import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestUser = createParamDecorator(
  (data: unknown, cxt: ExecutionContext) => {
    const req = cxt.switchToHttp().getRequest();
    return req.user;
  },
);
