import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class SafeGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
