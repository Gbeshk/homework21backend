import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SafeGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req: Request & { key: string } = context.switchToHttp().getRequest();
    const email = req.headers.email;

    if (email) {
      req['email'] = email;
    }

    return true;
  }
}
